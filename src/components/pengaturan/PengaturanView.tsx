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
  AlertCircle,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  Zap,
  BookOpen,
  HelpCircle,
  ArrowUpRight,
  QrCode
} from 'lucide-react';
import { getMayarConfig, saveMayarConfig, createMayarQRIS, type MayarConfig, type MayarPaymentResponse } from '../../lib/mayarService';

export const PengaturanView: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'staf' | 'cabang' | 'audit' | 'payment'>('staf');

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

  // Payment Gateway (Mayar.id) State
  const [mayarConfig, setMayarConfig] = useState<MayarConfig>(getMayarConfig());
  const [mayarApiKeyInput, setMayarApiKeyInput] = useState<string>(mayarConfig.apiKey);
  const [mayarIsSandbox, setMayarIsSandbox] = useState<boolean>(mayarConfig.isSandbox);
  const [mayarSavedToast, setMayarSavedToast] = useState<boolean>(false);
  const [copiedWebhook, setCopiedWebhook] = useState<boolean>(false);
  const [testQrisLoading, setTestQrisLoading] = useState<boolean>(false);
  const [testQrisResult, setTestQrisResult] = useState<MayarPaymentResponse | null>(null);

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

          <button
            onClick={() => setActiveTab('payment')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'payment' ? 700 : 600,
              backgroundColor: activeTab === 'payment' ? '#ffffff' : 'transparent',
              color: activeTab === 'payment' ? '#0284c7' : '#64748b',
              boxShadow: activeTab === 'payment' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            <CreditCard size={15} />
            <span>Payment Gateway (Mayar.id)</span>
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

      {/* TAB 4: PAYMENT GATEWAY (MAYAR.ID) */}
      {activeTab === 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Banner */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: '1px solid #86efac',
                }}>
                  ● Terhubung ke Mayar Gateway
                </span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: '1px solid #bae6fd',
                }}>
                  MDR QRIS 0.7% (Standar BI)
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Integrasi Mayar.id Payment Gateway (QRIS Dinamis POS)
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', maxWidth: '620px' }}>
                Menerima pembayaran digital otomatis dari BCA, Mandiri, GoPay, OVO, ShopeePay &amp; bank lainnya. Transaksi langsung diverifikasi via webhook tanpa kasir mengecek mutasi manual.
              </p>
            </div>

            <a
              href="https://dashboard.mayar.id"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <span>Dashboard Mayar.id</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Grid Layout: Config on Left, Architecture & MDR on Right */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            
            {/* Column 1: Configuration & Sandbox Tester */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Config Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #e2e8f0',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#0284c7" />
                  Konfigurasi API &amp; Webhook Mayar
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Mode Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      Mode Operasional Gateway
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setMayarIsSandbox(true)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: mayarIsSandbox ? '#0284c7' : '#e2e8f0',
                          backgroundColor: mayarIsSandbox ? '#f0f9ff' : '#f8fafc',
                          color: mayarIsSandbox ? '#0369a1' : '#64748b',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        🧪 Sandbox (Uji Coba &amp; Demo)
                      </button>

                      <button
                        type="button"
                        onClick={() => setMayarIsSandbox(false)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: !mayarIsSandbox ? '#16a34a' : '#e2e8f0',
                          backgroundColor: !mayarIsSandbox ? '#f0fdf4' : '#f8fafc',
                          color: !mayarIsSandbox ? '#15803d' : '#64748b',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        🚀 Production (Live Bisnis)
                      </button>
                    </div>
                  </div>

                  {/* API Key Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Mayar API Key ({mayarIsSandbox ? 'Sandbox Token' : 'Production Live Token'})
                    </label>
                    <input
                      type="password"
                      value={mayarApiKeyInput}
                      onChange={(e) => setMayarApiKeyInput(e.target.value)}
                      placeholder="Contoh: myr_live_... atau myr_test_..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                      Kosongkan untuk menggunakan Smart Simulation Mode saat presentasi ke mentor
                    </span>
                  </div>

                  {/* Webhook Endpoint Display */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Endpoint Webhook POS Lumbung
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        readOnly
                        value={mayarConfig.webhookUrl}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          fontSize: '11px',
                          color: '#475569',
                          fontFamily: 'monospace',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(mayarConfig.webhookUrl);
                          setCopiedWebhook(true);
                          setTimeout(() => setCopiedWebhook(false), 2000);
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#334155',
                        }}
                      >
                        {copiedWebhook ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                        <span>{copiedWebhook ? 'Tersalin' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={() => {
                      saveMayarConfig({
                        apiKey: mayarApiKeyInput,
                        isSandbox: mayarIsSandbox,
                      });
                      setMayarConfig(getMayarConfig());
                      setMayarSavedToast(true);
                      setTimeout(() => setMayarSavedToast(false), 3000);
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: '#78350f',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Check size={15} />
                    <span>{mayarSavedToast ? 'Pengaturan Berhasil Disimpan!' : 'Simpan Pengaturan Gateway'}</span>
                  </button>
                </div>
              </div>

              {/* Interactive QRIS Sandbox Tester */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #e2e8f0',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color="#eab308" />
                  Uji Coba Dynamic QRIS Sandbox
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                  Uji pembuatan tagihan QRIS Mayar langsung untuk memastikan respons API dan simulasi siap dipresentasikan.
                </p>

                <button
                  type="button"
                  disabled={testQrisLoading}
                  onClick={async () => {
                    setTestQrisLoading(true);
                    try {
                      const res = await createMayarQRIS({
                        amount: 32000,
                        orderNumber: `TEST-ORD-${Date.now().toString().slice(-4)}`,
                        customerName: 'Mentor Test Account',
                        branchName: 'Lumbung Tebet',
                        items: [
                          { nama: 'Americano', qty: 1, harga: 22000 },
                          { nama: 'Donat Gula Halus', qty: 1, harga: 10000 },
                        ],
                      });
                      setTestQrisResult(res);
                    } catch (e) {
                      console.error('Test QRIS error:', e);
                    } finally {
                      setTestQrisLoading(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    color: '#0369a1',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <QrCode size={15} />
                  <span>{testQrisLoading ? 'Menghubungi Mayar API...' : '🧪 Generate Dynamic QRIS Sandbox (Rp32.000)'}</span>
                </button>

                {testQrisResult && (
                  <div style={{
                    marginTop: '14px',
                    padding: '14px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <img
                      src={testQrisResult.qrCodeUrl}
                      alt="Preview QRIS"
                      style={{ width: '150px', height: '150px', borderRadius: '6px' }}
                    />
                    <div style={{ width: '100%', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span>Reference ID:</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{testQrisResult.paymentId}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span>Nominal:</span>
                        <span style={{ fontWeight: 700, color: '#16a34a' }}>Rp{testQrisResult.amount.toLocaleString('id-ID')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span>Biaya MDR (0.7%):</span>
                        <span style={{ fontWeight: 600 }}>Rp{testQrisResult.fee.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Fee Structure & Mentor Presentation Talking Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Fee Structure Card */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #e2e8f0',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
                  Struktur Biaya &amp; Settlement (MDR)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', display: 'block' }}>QRIS Nasional (BCA, Mandiri, E-Wallet)</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Sesuai regulasi Bank Indonesia</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0284c7' }}>0.7%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', display: 'block' }}>Virtual Account (BCA, Mandiri, BRI, BNI)</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Flat per transaksi berhasil</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>Rp3.000</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', display: 'block' }}>Biaya Sewa / Terminal EDC Bulanan</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Tidak memerlukan mesin hardware khusus</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#16a34a' }}>GRATIS (Rp0)</span>
                  </div>
                </div>
              </div>

              {/* Mentor Presentation Talking Points */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #fed7aa',
                background: 'linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <BookOpen size={16} color="#ea580c" />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                    Panduan Jawaban ke Mentor (Showcase Checklist)
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #ffedd5' }}>
                    <strong style={{ color: '#9a3412', display: 'block', marginBottom: '3px' }}>
                      1. Kenapa memilih Mayar.id dibandingkan gateway konvensional?
                    </strong>
                    <span>
                      Mayar menyediakan <em>REST API</em> modern, proses aktivasi instan tanpa verifikasi ribet, tanpa biaya sewa mesin EDC bulanan, serta mendukung webhook real-time yang langsung terhubung ke kasir POS Lumbung.
                    </span>
                  </div>

                  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #ffedd5' }}>
                    <strong style={{ color: '#9a3412', display: 'block', marginBottom: '3px' }}>
                      2. Kenapa Dynamic QRIS, bukan stiker QRIS statis biasa?
                    </strong>
                    <span>
                      Stiker statis rawan <strong>rekayasa screenshot palsu</strong> dan salah ketik nominal oleh pelanggan. Dynamic QRIS Mayar secara otomatis mengunci nominal tagihan pesanan dan unik per transaksi, sehingga kasir tidak perlu memverifikasi mutasi rekening bank secara manual.
                    </span>
                  </div>

                  <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #ffedd5' }}>
                    <strong style={{ color: '#9a3412', display: 'block', marginBottom: '3px' }}>
                      3. Bagaimana alur Webhook Callback POS Lumbung?
                    </strong>
                    <span>
                      Pelanggan scan QRIS Mayar &rarr; Bank / E-Wallet memproses dana &rarr; Server Mayar mengirimkan sinyal HTTP POST (Webhook) ke POS Lumbung &rarr; Sistem otomatis menandai transaksi &quot;LUNAS&quot; &rarr; Struk digital / cetak langsung terbit ke kasir.
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
