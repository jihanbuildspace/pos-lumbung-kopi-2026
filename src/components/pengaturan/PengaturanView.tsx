import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { SEED_PROFILES, SEED_CABANG } from '../../lib/seedData';
import { 
  Users, 
  Store, 
  FileText, 
  ShieldCheck, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserCheck, 
  UserX,
  AlertCircle
} from 'lucide-react';

export const PengaturanView: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'staf' | 'cabang' | 'audit'>('staf');

  // Staf State
  const [stafList, setStafList] = useState<any[]>(SEED_PROFILES);
  const [stafLoading, setStafLoading] = useState<boolean>(false);
  const [stafSearch, setStafSearch] = useState<string>('');

  // Cabang State
  const [cabangList, setCabangList] = useState<any[]>(SEED_CABANG);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [auditFilterAksi, setAuditFilterAksi] = useState<string>('semua');
  const [auditSearch, setAuditSearch] = useState<string>('');

  // Fetch Staf Profiles
  const fetchStaf = async () => {
    if (stafList.length === 0) setStafLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, cabang(*)')
        .order('peran')
        .order('nama_lengkap');

      if (!error && data && data.length > 0) {
        setStafList(data);
      } else {
        setStafList(SEED_PROFILES);
      }
    } catch (err) {
      console.error('Error fetching staf:', err);
      setStafList(SEED_PROFILES);
    } finally {
      setStafLoading(false);
    }
  };

  // Fetch Cabang
  const fetchCabang = async () => {
    try {
      const { data, error } = await supabase
        .from('cabang')
        .select('*')
        .order('kode');

      if (!error && data && data.length > 0) {
        setCabangList(data);
      }
    } catch (err) {
      console.error('Error fetching cabang:', err);
    }
  };

  // Fetch Audit Logs (on-demand when viewing audit tab)
  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select(`
          *,
          pelaku:profiles!audit_log_pelaku_id_fkey(*)
        `)
        .order('dibuat_pada', { ascending: false })
        .limit(100);

      if (!error && data) {
        setAuditLogs(data);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    fetchStaf();
    fetchCabang();
  }, []);

  useEffect(() => {
    if (activeTab === 'audit' && auditLogs.length === 0) {
      fetchAuditLogs();
    }
  }, [activeTab]);

  // Toggle User Active Status (BR-01, BR-12)
  const handleToggleAktif = async (user: any) => {
    const nextStatus = !user.aktif;
    const confirmMsg = nextStatus
      ? `Aktifkan kembali akun ${user.nama_lengkap} (${user.email})?`
      : `Nonaktifkan akun ${user.nama_lengkap}? Akun ini tidak akan dapat login ke sistem.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ aktif: nextStatus })
        .eq('id', user.id);

      if (error) {
        alert('Gagal mengubah status akun: ' + error.message);
        return;
      }

      // Record to audit_log (BR-12)
      if (profile) {
        await supabase.from('audit_log').insert({
          pelaku_id: profile.id,
          aksi: 'ubah_status_akun',
          tabel: 'profiles',
          data_id: user.id,
          nilai_sebelum: { aktif: user.aktif, email: user.email },
          nilai_sesudah: { aktif: nextStatus, email: user.email },
        });
      }

      alert(`Status akun ${user.nama_lengkap} berhasil diubah menjadi ${nextStatus ? 'AKTIF' : 'NON-AKTIF'}.`);
      await fetchStaf();
      await fetchAuditLogs();
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    }
  };

  // Filtered Staf
  const filteredStaf = stafList.filter((s) => {
    const q = stafSearch.toLowerCase();
    return (
      s.nama_lengkap?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.peran?.toLowerCase().includes(q) ||
      s.cabang?.nama?.toLowerCase().includes(q)
    );
  });

  // Filtered Audit Logs
  const filteredAudit = auditLogs.filter((log) => {
    const matchesAksi = auditFilterAksi === 'semua' || log.aksi === auditFilterAksi;
    const q = auditSearch.toLowerCase();
    const matchesSearch =
      log.aksi?.toLowerCase().includes(q) ||
      log.tabel?.toLowerCase().includes(q) ||
      log.pelaku?.nama_lengkap?.toLowerCase().includes(q);
    return matchesAksi && matchesSearch;
  });

  // Format action badge color
  const getActionBadge = (aksi: string) => {
    if (aksi.includes('void')) {
      return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', label: 'VOID TRANSAKSI' };
    }
    if (aksi.includes('verifikasi')) {
      return { bg: '#dcfce7', text: '#166534', border: '#86efac', label: 'VERIFIKASI SHIFT' };
    }
    if (aksi.includes('stok')) {
      return { bg: '#e0f2fe', text: '#075985', border: '#7dd3fc', label: 'PENYESUAIAN STOK' };
    }
    if (aksi.includes('harga')) {
      return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', label: 'UBAH HARGA' };
    }
    if (aksi.includes('akun')) {
      return { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe', label: 'PERUBAHAN AKUN' };
    }
    return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', label: aksi.toUpperCase() };
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="#78350f" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
              Pengaturan & Audit Sistem
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Otoritas Owner • Kelola staf, monitor cabang, dan telusuri jejak rekam audit log (BR-01, BR-12)
          </p>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '10px',
          gap: '4px',
        }}>
          <button
            onClick={() => setActiveTab('staf')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'staf' ? 700 : 600,
              backgroundColor: activeTab === 'staf' ? '#ffffff' : 'transparent',
              color: activeTab === 'staf' ? '#78350f' : '#64748b',
              boxShadow: activeTab === 'staf' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            <Users size={15} />
            <span>Akun Staf ({stafList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cabang')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'cabang' ? 700 : 600,
              backgroundColor: activeTab === 'cabang' ? '#ffffff' : 'transparent',
              color: activeTab === 'cabang' ? '#78350f' : '#64748b',
              boxShadow: activeTab === 'cabang' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            <Store size={15} />
            <span>Cabang ({cabangList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'audit' ? 700 : 600,
              backgroundColor: activeTab === 'audit' ? '#ffffff' : 'transparent',
              color: activeTab === 'audit' ? '#78350f' : '#64748b',
              boxShadow: activeTab === 'audit' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            <FileText size={15} />
            <span>Audit Log ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: AKUN STAF */}
      {activeTab === 'staf' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '320px',
              gap: '8px',
            }}>
              <Search size={15} color="#94a3b8" />
              <input
                type="text"
                placeholder="Cari nama, email, peran..."
                value={stafSearch}
                onChange={(e) => setStafSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
                  width: '100%',
                }}
              />
            </div>

            <button
              onClick={fetchStaf}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>Segarkan</span>
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Nama Staf</th>
                  <th style={{ padding: '12px 16px' }}>Email</th>
                  <th style={{ padding: '12px 16px' }}>Peran</th>
                  <th style={{ padding: '12px 16px' }}>Penempatan Cabang</th>
                  <th style={{ padding: '12px 16px' }}>Status Akun</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi Owner</th>
                </tr>
              </thead>
              <tbody>
                {stafLoading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      Memuat daftar staf...
                    </td>
                  </tr>
                ) : filteredStaf.map((s) => {
                  const isOwnerAccount = s.peran === 'owner';
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                        {s.nama_lengkap}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569', fontFamily: 'monospace', fontSize: '12px' }}>
                        {s.email}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor:
                            s.peran === 'owner' ? '#fef3c7' : s.peran === 'kepala_toko' ? '#e0e7ff' : '#ecfdf5',
                          color:
                            s.peran === 'owner' ? '#92400e' : s.peran === 'kepala_toko' ? '#3730a3' : '#065f46',
                          textTransform: 'uppercase',
                        }}>
                          {s.peran === 'kepala_toko' ? 'Kepala Toko' : s.peran}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>
                        {s.cabang?.nama || (isOwnerAccount ? 'Semua Cabang' : '-')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {s.aktif ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#059669',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}>
                            <CheckCircle2 size={14} /> Aktif
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#dc2626',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}>
                            <XCircle size={14} /> Non-Aktif
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {isOwnerAccount ? (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Akun Utama</span>
                        ) : (
                          <button
                            onClick={() => handleToggleAktif(s)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: `1px solid ${s.aktif ? '#fca5a5' : '#86efac'}`,
                              backgroundColor: s.aktif ? '#fff1f2' : '#f0fdf4',
                              color: s.aktif ? '#e11d48' : '#16a34a',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {s.aktif ? <UserX size={13} /> : <UserCheck size={13} />}
                            <span>{s.aktif ? 'Nonaktifkan' : 'Aktifkan'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DATA CABANG */}
      {activeTab === 'cabang' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Kode</th>
                <th style={{ padding: '12px 16px' }}>Nama Cabang</th>
                <th style={{ padding: '12px 16px' }}>Alamat</th>
                <th style={{ padding: '12px 16px' }}>Status Operasional</th>
              </tr>
            </thead>
            <tbody>
              {cabangList.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 800, color: '#78350f', fontSize: '14px' }}>
                    {c.kode}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                    {c.nama}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {c.alamat}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#059669',
                      fontWeight: 700,
                      fontSize: '12px',
                    }}>
                      <CheckCircle2 size={14} /> Beroperasi Normal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '6px 12px',
                width: '280px',
                gap: '8px',
              }}>
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Cari aksi, tabel, atau staf..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '13px',
                    width: '100%',
                  }}
                />
              </div>

              <select
                value={auditFilterAksi}
                onChange={(e) => setAuditFilterAksi(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <option value="semua">Semua Aksi</option>
                <option value="void_transaksi">Void Transaksi</option>
                <option value="verifikasi_shift">Verifikasi Shift</option>
                <option value="sesuaikan_stok">Penyesuaian Stok</option>
                <option value="ubah_harga_modal">Ubah Harga Modal</option>
                <option value="ubah_harga_jual">Ubah Harga Jual</option>
                <option value="ubah_status_akun">Perubahan Akun</option>
              </select>
            </div>

            <button
              onClick={fetchAuditLogs}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>Segarkan</span>
            </button>
          </div>

          {/* Audit Table */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Waktu (WIB)</th>
                  <th style={{ padding: '12px 16px' }}>Pelaku</th>
                  <th style={{ padding: '12px 16px' }}>Aksi</th>
                  <th style={{ padding: '12px 16px' }}>Tabel</th>
                  <th style={{ padding: '12px 16px' }}>Detail Nilai Sebelum</th>
                  <th style={{ padding: '12px 16px' }}>Detail Nilai Sesudah</th>
                </tr>
              </thead>
              <tbody>
                {auditLoading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      Memuat rekaman audit...
                    </td>
                  </tr>
                ) : filteredAudit.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      Tidak ada catatan audit yang sesuai
                    </td>
                  </tr>
                ) : filteredAudit.map((log) => {
                  const badge = getActionBadge(log.aksi);
                  const waktuStr = new Date(log.dibuat_pada).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          <span>{waktuStr}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                        {log.pelaku?.nama_lengkap || 'System / Auto'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                          whiteSpace: 'nowrap',
                        }}>
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#475569', fontSize: '11px' }}>
                        {log.tabel}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b', maxWidth: '240px' }}>
                        {log.nilai_sebelum ? (
                          <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {JSON.stringify(log.nilai_sebelum)}
                          </div>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11px', color: '#047857', maxWidth: '240px' }}>
                        {log.nilai_sesudah ? (
                          <div style={{
                            backgroundColor: '#ecfdf5',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #a7f3d0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {JSON.stringify(log.nilai_sesudah)}
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
