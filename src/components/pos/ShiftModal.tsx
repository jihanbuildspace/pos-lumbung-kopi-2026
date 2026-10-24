import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { useAuth } from '../../context/AuthContext';
import { X, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface ShiftModalProps {
  mode: 'buka' | 'tutup';
  show: boolean;
  onClose: () => void;
}

export const ShiftModal: React.FC<ShiftModalProps> = ({ mode, show, onClose }) => {
  const { activeShift, openShift, closeShift } = usePOS();
  const { profile, cabang } = useAuth();

  const [kasAwal, setKasAwal] = useState<number>(500000);
  const [uangFisik, setUangFisik] = useState<number>(0);
  const [catatan, setCatatan] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!show) return null;

  // Kas Seharusnya & Selisih untuk mode Tutup
  const kasAwalShift = activeShift?.kas_awal || 0;
  const totalTunaiShift = activeShift?.total_tunai || 0;
  const kasSeharusnya = kasAwalShift + totalTunaiShift;
  const selisih = uangFisik - kasSeharusnya;
  const isLargeDiscrepancy = Math.abs(selisih) > 20000;

  const handleOpenShift = async () => {
    if (kasAwal < 0) {
      setErrorMsg('Kas awal tidak boleh minus');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await openShift(kasAwal);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Gagal membuka shift');
    }
  };

  const handleCloseShift = async () => {
    if (isLargeDiscrepancy && (!catatan || catatan.trim() === '')) {
      setErrorMsg('BR-09: Selisih kas lebih dari Rp20.000 wajib menyertakan catatan kasir!');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await closeShift(uangFisik, catatan);
    setLoading(false);
    if (res.success) {
      alert(`Shift berhasil ditutup! Selisih kas: Rp${(res.selisih || 0).toLocaleString('id-ID')}`);
      onClose();
    } else {
      setErrorMsg(res.error || 'Gagal menutup shift');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: mode === 'buka' ? '#fef3c7' : '#fee2e2',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color={mode === 'buka' ? '#92400e' : '#b91c1c'} />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: mode === 'buka' ? '#92400e' : '#b91c1c' }}>
              {mode === 'buka' ? 'Buka Shift Kasir Baru' : 'Tutup Shift Kasir'}
            </h3>
          </div>
          <button onClick={onClose} style={{ color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              fontSize: '12px',
              fontWeight: 500,
              marginBottom: '16px',
            }}>
              {errorMsg}
            </div>
          )}

          {mode === 'buka' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569' }}>
                <p><strong>Kasir:</strong> {profile?.nama_lengkap}</p>
                <p><strong>Cabang:</strong> {cabang?.nama} ({cabang?.kode})</p>
                <p><strong>Waktu:</strong> {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Jumlah Kas Awal di Laci (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={kasAwal}
                  onChange={(e) => setKasAwal(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {[300000, 500000, 1000000].map((nominal) => (
                    <button
                      key={nominal}
                      type="button"
                      onClick={() => setKasAwal(nominal)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: kasAwal === nominal ? '#fef3c7' : '#ffffff',
                        color: kasAwal === nominal ? '#92400e' : '#475569',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      Rp{nominal.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                fontSize: '12px',
              }}>
                <div>
                  <span style={{ color: '#64748b' }}>Kas Awal:</span>
                  <p style={{ fontWeight: 700 }}>Rp{kasAwalShift.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Total Tunai:</span>
                  <p style={{ fontWeight: 700 }}>Rp{totalTunaiShift.toLocaleString('id-ID')}</p>
                </div>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  <span style={{ color: '#64748b' }}>Kas Seharusnya (Kas Awal + Tunai):</span>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                    Rp{kasSeharusnya.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Hitungan Uang Fisik Aktual di Laci (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Masukkan jumlah uang fisik di laci"
                  value={uangFisik || ''}
                  onChange={(e) => setUangFisik(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>

              {/* Discrepancy Indicator */}
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: isLargeDiscrepancy ? '#fee2e2' : selisih === 0 ? '#ecfdf5' : '#fffbeb',
                border: `1px solid ${isLargeDiscrepancy ? '#fca5a5' : selisih === 0 ? '#a7f3d0' : '#fde68a'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Selisih Kas:</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: isLargeDiscrepancy ? '#b91c1c' : selisih === 0 ? '#059669' : '#b45309',
                  }}>
                    {selisih > 0 ? '+' : ''}Rp{selisih.toLocaleString('id-ID')}
                  </div>
                </div>
                {isLargeDiscrepancy ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b91c1c', fontSize: '11px', fontWeight: 700 }}>
                    <AlertTriangle size={15} />
                    <span>Selisih &gt; Rp20.000</span>
                  </div>
                ) : selisih === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                    <CheckCircle size={15} />
                    <span>Kas Cocok</span>
                  </div>
                ) : null}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Catatan Kasir {isLargeDiscrepancy && <span style={{ color: '#dc2626' }}>* (Wajib diisi karena selisih &gt; Rp20.000)</span>}
                </label>
                <textarea
                  rows={2}
                  placeholder={isLargeDiscrepancy ? 'Wajib jelaskan penyebab selisih kas...' : 'Catatan opsional...'}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${isLargeDiscrepancy && !catatan ? '#ef4444' : '#cbd5e1'}`,
                    fontSize: '12px',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={onClose}
              disabled={loading}
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
              onClick={mode === 'buka' ? handleOpenShift : handleCloseShift}
              disabled={loading}
              style={{
                flex: 1.5,
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: mode === 'buka' ? '#78350f' : '#dc2626',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Memproses...' : mode === 'buka' ? 'Buka Shift' : 'Konfirmasi Tutup Shift'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
