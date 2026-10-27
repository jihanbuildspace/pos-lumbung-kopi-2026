import React from 'react';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  show: boolean;
  onClose: () => void;
  transaksi: any;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ show, onClose, transaksi }) => {
  if (!show || !transaksi) return null;

  const handlePrint = () => {
    window.print();
  };

  const items = transaksi.items || [];
  const cabang = transaksi.cabang || {
    nama: 'Lumbung POS',
    alamat: 'Jl. Tebet Raya No. 41, Jakarta Selatan',
  };
  const kasirNama = transaksi.kasir?.nama_lengkap || 'Kasir';
  const waktu = new Date(transaksi.dibuat_pada || Date.now()).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

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
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        {/* Header modal */}
        <div className="no-print" style={{
          padding: '14px 18px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f0fdf4',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
            }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#166534', display: 'block' }}>
                Pembayaran Berhasil!
              </span>
              <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                Transaksi lunas tercatat di sistem
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#64748b', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* 58mm Thermal Receipt Area */}
        <div style={{
          padding: '20px 24px 24px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f1f5f9',
        }}>
          {/* Prominent Success Pill */}
          <div className="no-print" style={{
            marginBottom: '14px',
            padding: '8px 16px',
            backgroundColor: '#dcfce7',
            border: '1.5px solid #86efac',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#166534',
            fontSize: '12px',
            fontWeight: 800,
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.1)',
          }}>
            <CheckCircle2 size={15} color="#16a34a" />
            <span>PEMBAYARAN BERHASIL • STRUK SIAP DICETAK</span>
          </div>

          <div
            id="printable-receipt"
            style={{
              width: '280px',
              backgroundColor: '#ffffff',
              padding: '16px 14px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#000000',
              lineHeight: 1.35,
              borderRadius: '2px',
            }}
          >
            {/* Store Name & Branch */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>LUMBUNG KOPI DAN ROTI</div>
              <div style={{ fontSize: '10px' }}>{cabang.nama}</div>
              <div style={{ fontSize: '9px', color: '#333' }}>{cabang.alamat}</div>
            </div>

            <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />

            {/* Meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>No. Struk:</span>
              <span style={{ fontWeight: 'bold' }}>{transaksi.nomor_struk}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Waktu:</span>
              <span>{waktu}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Kasir:</span>
              <span>{kasirNama}</span>
            </div>

            {/* Tipe Pesanan & Nama Pelanggan */}
            <div style={{
              margin: '6px 0',
              padding: '4px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #000',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '11px',
              letterSpacing: '0.5px',
            }}>
              {transaksi.tipe_pesanan === 'takeaway' ? 'TAKEAWAY (BUNGKUS)' : 'DINE-IN (MAKAN DI TEMPAT)'}
              {transaksi.nama_pelanggan ? ` • ${transaksi.nama_pelanggan.toUpperCase()}` : ''}
            </div>

            <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '4px 0' }}>
              {items.map((it: any, i: number) => (
                <div key={i}>
                  <div style={{ fontWeight: 'bold' }}>{it.nama_produk}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '8px' }}>
                    <span>{it.jumlah} x Rp{it.harga_satuan?.toLocaleString('id-ID')}</span>
                    <span>Rp{it.subtotal?.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />

            {/* Calculations */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>Rp{(transaksi.subtotal ?? 0).toLocaleString('id-ID')}</span>
            </div>
            {(transaksi.diskon || 0) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#000' }}>
                <span>Diskon ({transaksi.alasan_diskon || 'Promo'})</span>
                <span>-Rp{(transaksi.diskon || 0).toLocaleString('id-ID')}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: 'bold',
              margin: '4px 0',
            }}>
              <span>TOTAL</span>
              <span>Rp{(transaksi.total ?? 0).toLocaleString('id-ID')}</span>
            </div>

            <div style={{ borderBottom: '1px dashed #000', margin: '6px 0' }} />

            {/* Payment Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Metode Bayar:</span>
              <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {transaksi.metode_bayar === 'qris' ? 'QRIS (Mayar.id)' : (transaksi.metode_bayar || 'TUNAI')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bayar:</span>
              <span>Rp{(transaksi.uang_diterima ?? 0).toLocaleString('id-ID')}</span>
            </div>
            {(transaksi.metode_bayar === 'tunai' || !transaksi.metode_bayar) && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Kembalian:</span>
                <span style={{ fontWeight: 'bold' }}>Rp{(transaksi.kembalian ?? 0).toLocaleString('id-ID')}</span>
              </div>
            )}

            <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

            {/* Footer */}
            <div style={{ textAlign: 'center', fontSize: '9px', lineHeight: 1.4 }}>
              <div>Terima kasih atas kunjungan Anda!</div>
              <div>Wi-Fi: LumbungKopi / Sandi: kopi2026</div>
              <div>Simpan struk ini sebagai bukti transaksi yang sah.</div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="no-print" style={{
          padding: '14px 18px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          gap: '12px',
          backgroundColor: '#ffffff',
        }}>
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#78350f',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(120, 53, 15, 0.25)',
            }}
          >
            <Printer size={16} />
            <span>Cetak Struk (58 mm)</span>
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
