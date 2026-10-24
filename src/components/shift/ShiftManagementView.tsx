import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { usePOS } from '../../context/POSContext';
import type { ShiftKasir } from '../../types/database';
import { Users, Clock, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, DollarSign, CreditCard, Lock, Play } from 'lucide-react';

interface ShiftManagementViewProps {
  onOpenShiftModal?: () => void;
  onCloseShiftModal?: () => void;
}

export const ShiftManagementView: React.FC<ShiftManagementViewProps> = ({
  onOpenShiftModal,
  onCloseShiftModal,
}) => {
  const { profile, cabang, allCabang } = useAuth();
  const { activeShift } = usePOS();
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusTab, setStatusTab] = useState<string>('semua');
  const [selectedCabangId, setSelectedCabangId] = useState<string>(profile?.cabang_id || 'semua');

  // Verify modal state
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [targetShift, setTargetShift] = useState<any | null>(null);
  const [catatanVerifikasi, setCatatanVerifikasi] = useState<string>('');
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string>('');

  useEffect(() => {
    if (profile?.peran !== 'owner' && profile?.cabang_id) {
      setSelectedCabangId(profile.cabang_id);
    } else if (profile?.peran === 'owner') {
      setSelectedCabangId('semua');
    }
  }, [profile?.id, profile?.peran]);

  const fetchShifts = async () => {
    if (shifts.length === 0) {
      setLoading(true);
    }
    try {
      let query = supabase
        .from('shift_kasir')
        .select(`
          *,
          cabang:cabang(*),
          kasir:profiles!shift_kasir_kasir_id_fkey(*),
          verifikator:profiles!shift_kasir_diverifikasi_oleh_fkey(*)
        `)
        .order('dibuka_pada', { ascending: false });

      if (profile?.peran === 'kasir') {
        query = query.eq('kasir_id', profile.id);
      } else if (profile?.peran === 'kepala_toko') {
        query = query.eq('cabang_id', profile.cabang_id);
      } else if (profile?.peran === 'owner' && selectedCabangId !== 'semua') {
        query = query.eq('cabang_id', selectedCabangId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching shifts:', error);
      } else if (data) {
        setShifts(data);
      }
    } catch (err) {
      console.error('fetchShifts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [profile?.id, profile?.peran, selectedCabangId]);

  const counts = {
    semua: shifts.length,
    buka: shifts.filter((s) => s.status === 'buka').length,
    ditutup: shifts.filter((s) => s.status === 'ditutup').length,
    diverifikasi: shifts.filter((s) => s.status === 'diverifikasi').length,
  };

  const filteredShifts = shifts.filter((s) => {
    if (statusTab === 'semua') return true;
    return s.status === statusTab;
  });

  const handleOpenVerify = (shift: any) => {
    setTargetShift(shift);
    setCatatanVerifikasi('');
    setVerifyError('');
    setShowVerifyModal(true);
  };

  const handleConfirmVerify = async () => {
    if (!targetShift || !profile) return;
    setVerifyLoading(true);
    setVerifyError('');

    try {
      const { data, error } = await supabase.rpc('rpc_verifikasi_shift', {
        p_shift_id: targetShift.id,
        p_user_id: profile.id,
        p_catatan: catatanVerifikasi.trim() || null,
      });

      if (error) {
        setVerifyError(error.message);
      } else {
        alert('Shift berhasil diverifikasi!');
        setShowVerifyModal(false);
        setTargetShift(null);
        await fetchShifts();
      }
    } catch (err: any) {
      setVerifyError(err.message || 'Gagal memverifikasi shift');
    } finally {
      setVerifyLoading(false);
    }
  };

  const canVerify = profile?.peran === 'kepala_toko' || profile?.peran === 'owner';

  const isKasir = profile?.peran === 'kasir';

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
            {isKasir ? 'Shift Saya' : 'Shift Cabang'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {isKasir
              ? `${cabang?.nama || 'Cabang'} • Kendali shift kasir dan rekonsiliasi kas laci (BR-02, BR-09)`
              : profile?.peran === 'owner'
                ? 'Monitoring shift dan rekonsiliasi kas kasir seluruh cabang'
                : `${cabang?.nama} • Riwayat shift kasir dan verifikasi rekonsiliasi kas`}
          </p>
        </div>

        {profile?.peran === 'owner' && (
          <select
            value={selectedCabangId}
            onChange={(e) => setSelectedCabangId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              outline: 'none',
            }}
          >
            <option value="semua">Semua Cabang</option>
            {allCabang.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama} ({c.kode})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* KASIR HERO CARD: Shift Aktif Berjalan (PRD Section 7: Shift Saya) */}
      {isKasir && (
        <div style={{
          backgroundColor: activeShift ? '#ffffff' : '#fffbeb',
          border: `1px solid ${activeShift ? '#e2e8f0' : '#fef3c7'}`,
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        }}>
          {activeShift ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#065f46' }}>
                    SHIFT AKTIF BERJALAN
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    (Dibuka sejak {new Date(activeShift.waktu_buka || activeShift.dibuka_pada as any).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB)
                  </span>
                </div>

                {onCloseShiftModal && (
                  <button
                    onClick={onCloseShiftModal}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#78350f',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(120, 53, 15, 0.2)',
                    }}
                  >
                    <Lock size={15} />
                    <span>Tutup Shift & Hitung Uang Fisik</span>
                  </button>
                )}
              </div>

              {/* 4 Shift Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Kas Awal Laci</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                    Rp{(activeShift.kas_awal || 0).toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ backgroundColor: '#ecfdf5', padding: '12px 16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '11px', color: '#065f46', fontWeight: 600 }}>Total Penjualan Tunai</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#047857', marginTop: '4px' }}>
                    Rp{(activeShift.total_tunai || 0).toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ backgroundColor: '#eff6ff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>Total Penjualan QRIS</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
                    Rp{(activeShift.total_qris || 0).toLocaleString('id-ID')}
                  </div>
                </div>

                <div style={{ backgroundColor: '#fffbeb', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>Kas Seharusnya di Laci</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                    Rp{((activeShift.kas_awal || 0) + (activeShift.total_tunai || 0)).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="#d97706" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#92400e' }}>
                    Shift Belum Dibuka
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#78350f', marginTop: '4px' }}>
                  Anda belum membuka shift kasir. Buka shift dengan mengisi kas awal laci untuk dapat melayani transaksi kasir (BR-02).
                </p>
              </div>

              {onOpenShiftModal && (
                <button
                  onClick={onOpenShiftModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.25)',
                  }}
                >
                  <Play size={15} />
                  <span>Buka Shift Baru</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'semua', label: `Semua (${counts.semua})` },
            { key: 'buka', label: `Buka (${counts.buka})` },
            { key: 'ditutup', label: `Ditutup (${counts.ditutup})` },
            { key: 'diverifikasi', label: `Diverifikasi (${counts.diverifikasi})` },
          ].map((tab) => {
            const isActive = statusTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusTab(tab.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#78350f' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={fetchShifts}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#475569',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Shift Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Memuat riwayat shift...
          </div>
        ) : filteredShifts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Tidak ada data shift pada status ini
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Waktu Buka</th>
                <th style={{ padding: '12px 16px' }}>Kasir</th>
                {profile?.peran === 'owner' && <th style={{ padding: '12px 16px' }}>Cabang</th>}
                <th style={{ padding: '12px 16px' }}>Kas Awal</th>
                <th style={{ padding: '12px 16px' }}>Kas Seharusnya</th>
                <th style={{ padding: '12px 16px' }}>Uang Fisik</th>
                <th style={{ padding: '12px 16px' }}>Selisih Kas</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredShifts.map((s) => {
                const isOpen = s.status === 'buka';
                const isVerified = s.status === 'diverifikasi';
                const isLargeDiscrepancy = s.selisih !== null && Math.abs(s.selisih) > 20000;
                const dateBuka = new Date(s.dibuka_pada).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                      {dateBuka}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      {s.kasir?.nama_lengkap || '-'}
                    </td>
                    {profile?.peran === 'owner' && (
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {s.cabang?.kode}
                      </td>
                    )}
                    <td style={{ padding: '12px 16px' }}>
                      Rp{s.kas_awal?.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {s.kas_seharusnya !== null ? `Rp${s.kas_seharusnya?.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {s.uang_fisik !== null ? `Rp${s.uang_fisik?.toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {s.selisih !== null ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: isLargeDiscrepancy ? '#fee2e2' : s.selisih === 0 ? '#ecfdf5' : '#fffbeb',
                          color: isLargeDiscrepancy ? '#b91c1c' : s.selisih === 0 ? '#059669' : '#b45309',
                        }}>
                          {isLargeDiscrepancy && <AlertTriangle size={13} />}
                          <span>{s.selisih > 0 ? '+' : ''}Rp{s.selisih?.toLocaleString('id-ID')}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isOpen ? '#fef3c7' : isVerified ? '#ecfdf5' : '#e0e7ff',
                        color: isOpen ? '#92400e' : isVerified ? '#065f46' : '#3730a3',
                        textTransform: 'uppercase',
                      }}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {s.status === 'ditutup' && canVerify ? (
                        <button
                          onClick={() => handleOpenVerify(s)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          <ShieldCheck size={14} />
                          <span>Verifikasi</span>
                        </button>
                      ) : isVerified ? (
                        <span style={{ fontSize: '11px', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <CheckCircle2 size={13} />
                          <span>Terverifikasi</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Verifikasi Shift (BR-10) */}
      {showVerifyModal && targetShift && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#e0e7ff',
              borderBottom: '1px solid #c7d2fe',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#3730a3',
            }}>
              <ShieldCheck size={20} />
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>
                Verifikasi Shift Kasir (BR-10)
              </h3>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
                <p><strong>Kasir:</strong> {targetShift.kasir?.nama_lengkap}</p>
                <p><strong>Kas Seharusnya:</strong> Rp{targetShift.kas_seharusnya?.toLocaleString('id-ID')}</p>
                <p><strong>Uang Fisik Kasir:</strong> Rp{targetShift.uang_fisik?.toLocaleString('id-ID')}</p>
                <p style={{ marginTop: '4px', fontWeight: 700, color: Math.abs(targetShift.selisih || 0) > 20000 ? '#b91c1c' : '#059669' }}>
                  Selisih Kas: Rp{(targetShift.selisih || 0).toLocaleString('id-ID')}
                </p>
                {targetShift.catatan_tutup && (
                  <p style={{ marginTop: '4px', color: '#475569', fontStyle: 'italic' }}>
                    Catatan kasir: "{targetShift.catatan_tutup}"
                  </p>
                )}
              </div>

              {verifyError && (
                <div style={{ padding: '10px', backgroundColor: '#fee2e2', borderRadius: '6px', color: '#991b1b', fontSize: '11px', fontWeight: 600 }}>
                  {verifyError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Catatan Verifikasi (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Sudah diperiksa dan sesuai hasil fisik kas..."
                  value={catatanVerifikasi}
                  onChange={(e) => setCatatanVerifikasi(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  disabled={verifyLoading}
                  onClick={() => setShowVerifyModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                  }}
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={verifyLoading}
                  onClick={handleConfirmVerify}
                  style={{
                    flex: 1.5,
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#3730a3',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {verifyLoading ? 'Memverifikasi...' : 'Verifikasi Shift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
