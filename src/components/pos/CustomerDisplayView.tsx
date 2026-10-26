import React, { useState, useEffect } from 'react';
import {
  subscribeCustomerDisplay,
  type CustomerDisplayPayload,
} from '../../lib/customerDisplayService';
import { Coffee, QrCode, Banknote, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const CustomerDisplayView: React.FC = () => {
  const [data, setData] = useState<CustomerDisplayPayload>({
    cabangNama: 'Lumbung Kopi dan Roti',
    tipePesanan: 'dine_in',
    namaPelanggan: '',
    items: [],
    subtotal: 0,
    diskon: 0,
    total: 0,
    metodeBayar: 'tunai',
    uangDiterima: 0,
    kembalian: 0,
    status: 'idle',
  });

  const [currentTime, setCurrentTime] = useState<string>('');

  // Rating & Thank You Modal State
  const [showThankYouMode, setShowThankYouMode] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<'baik' | 'sedang' | 'buruk' | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  useEffect(() => {
    // Clock interval
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Subscribe to cashier broadcast
    const unsubscribe = subscribeCustomerDisplay((payload) => {
      setData(payload);

      if (payload.status === 'completed' && payload.lastCompletedStruk) {
        setShowThankYouMode(true);
        setRatingSubmitted(false);
        setSelectedRating(null);
      } else if (payload.items && payload.items.length > 0) {
        setShowThankYouMode(false);
        setRatingSubmitted(false);
        setSelectedRating(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-close overlay if customer walks away without tapping emoji (7 seconds)
  useEffect(() => {
    let timer: any;
    if (showThankYouMode && !ratingSubmitted) {
      timer = setTimeout(() => {
        setShowThankYouMode(false);
        setRatingSubmitted(false);
        setSelectedRating(null);
      }, 7000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showThankYouMode, ratingSubmitted]);

  const handleSelectRating = (rating: 'baik' | 'sedang' | 'buruk') => {
    setSelectedRating(rating);
    setRatingSubmitted(true);

    try {
      const existing = JSON.parse(localStorage.getItem('lumbung_customer_ratings') || '[]');
      existing.push({
        rating,
        cabang: data.cabangNama,
        nomor_struk: data.lastCompletedStruk || '-',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('lumbung_customer_ratings', JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to save rating:', e);
    }

    // Auto LANGSUNG kembali ke layar Selamat Datang (1.2 detik cukup untuk melihat konfirmasi bintang)
    setTimeout(() => {
      setShowThankYouMode(false);
      setRatingSubmitted(false);
      setSelectedRating(null);
    }, 1200);
  };

  const hasItems = data.items && data.items.length > 0;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fbf8f3',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
    }}>
      {/* Top Banner Header */}
      <header style={{
        backgroundColor: '#451a03',
        color: '#ffffff',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(69, 26, 3, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#78350f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <Coffee size={24} color="#fde68a" />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px', margin: 0 }}>
              LUMBUNG KOPI DAN ROTI
            </h1>
            <p style={{ fontSize: '12px', color: '#fde68a', margin: '2px 0 0 0', fontWeight: 600 }}>
              {data.cabangNama || 'Kedai Kopi & Toko Roti'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            color: '#cbd5e1',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 8px #10b981',
            }} />
            <span>Layar Pelanggan Terhubung</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#fde68a', fontWeight: 700 }}>
            <Clock size={16} />
            <span>{currentTime}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        padding: '16px',
        gap: '16px',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}>
        {/* Left Column: Order Items or Welcome Showcase */}
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f1ece4',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {hasItems ? (
            <>
              {/* Active Order Header */}
              <div style={{
                paddingBottom: '16px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: data.tipePesanan === 'takeaway' ? '#fef3c7' : '#ecfdf5',
                      color: data.tipePesanan === 'takeaway' ? '#92400e' : '#065f46',
                      border: `1px solid ${data.tipePesanan === 'takeaway' ? '#fde68a' : '#a7f3d0'}`,
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                    }}>
                      {data.tipePesanan === 'takeaway' ? '🛍️ Bawa Pulang (Takeaway)' : '🍽️ Makan di Tempat (Dine-In)'}
                    </span>
                    {data.namaPelanggan && (
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                        Atas Nama: <span style={{ color: '#78350f' }}>{data.namaPelanggan}</span>
                      </span>
                    )}
                  </div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginTop: '8px' }}>
                    Rincian Pesanan Anda
                  </h2>
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#64748b',
                  backgroundColor: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '8px',
                }}>
                  {data.items.reduce((acc, curr) => acc + curr.jumlah, 0)} Item
                </div>
              </div>

              {/* Items List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                {data.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: '#fbfaf8',
                      borderRadius: '12px',
                      border: '1px solid #f3ece4',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#78350f',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 800,
                        flexShrink: 0,
                      }}>
                        {item.jumlah}x
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>
                          {item.nama}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Rp{item.harga_satuan.toLocaleString('id-ID')} / unit
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#78350f' }}>
                      Rp{item.subtotal.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Welcome Idle Screen when cart is empty */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '16px 20px',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                boxShadow: '0 8px 16px rgba(120, 53, 15, 0.1)',
              }}>
                <Coffee size={32} color="#78350f" />
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#451a03', margin: 0 }}>
                Selamat Datang di Lumbung!
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', marginTop: '6px', lineHeight: 1.5 }}>
                Kopi racikan barista terampil dan aneka roti segar dipanggang setiap pagi. Silakan sampaikan pesanan Anda kepada kasir kami.
              </p>

              {/* Showcase Cards */}
              <div style={{
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                width: '100%',
              }}>
                <div style={{
                  padding: '12px 10px',
                  backgroundColor: '#fdfbf7',
                  border: '1px solid #f3ece4',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: '20px' }}>☕</span>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                    Kopi Susu Lumbung
                  </div>
                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>Favorit Kedai</div>
                </div>

                <div style={{
                  padding: '12px 10px',
                  backgroundColor: '#fdfbf7',
                  border: '1px solid #f3ece4',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: '20px' }}>🥐</span>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                    Croissant Mentega
                  </div>
                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>Hangat &amp; Renyah</div>
                </div>

                <div style={{
                  padding: '12px 10px',
                  backgroundColor: '#fdfbf7',
                  border: '1px solid #f3ece4',
                  borderRadius: '12px',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: '20px' }}>🍞</span>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                    Roti Cokelat Klasik
                  </div>
                  <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>Cokelat Lumer</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Column: Billing Summary & Payment QRIS / Cash */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {/* Total Billing Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1ece4',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Ringkasan Pembayaran
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>
                Rp{data.subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            {data.diskon > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#dc2626' }}>
                <span>Potongan Diskon:</span>
                <span style={{ fontWeight: 700 }}>
                  -Rp{data.diskon.toLocaleString('id-ID')}
                </span>
              </div>
            )}

            <div style={{
              marginTop: '4px',
              paddingTop: '14px',
              borderTop: '2px dashed #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                Total Bayar:
              </span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#78350f', letterSpacing: '-0.5px' }}>
                Rp{data.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Method Presentation */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1ece4',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            {data.metodeBayar === 'qris' && hasItems ? (
              /* QRIS Interactive Display */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  marginBottom: '12px',
                  border: '1px solid #bfdbfe',
                }}>
                  <QrCode size={14} />
                  <span>QRIS DINAMIS • MAYAR.ID</span>
                </div>

                {/* High Contrast Authentic QRIS Presentation */}
                <div style={{
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  maxWidth: '240px',
                  margin: '0 auto',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#1e293b', letterSpacing: '2px' }}>
                      QRIS
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>
                      Lumbung Kopi dan Roti
                    </span>
                  </div>

                  <div style={{
                    padding: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #f1f5f9',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                  }}>
                    <img
                      src={data.mayarQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&data=${encodeURIComponent(`00020101021226680016ID.MAYAR.WWW01189360091100200000020215MYR-LUMBUNG520458125303360540${data.total}5802ID5918LUMBUNG+KOPI+ROTI6007JAKARTA6304ABCD`)}`}
                      alt="QRIS Mayar.id Asli"
                      style={{ width: '170px', height: '170px', display: 'block', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
                      NMID: ID102458921820
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#78350f', marginTop: '2px' }}>
                      Rp{data.total.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px', textAlign: 'center', lineHeight: 1.4 }}>
                  Scan menggunakan BCA, Mandiri Livin, GoPay, OVO, ShopeePay, DANA atau aplikasi perbankan apa saja.
                </p>
              </div>
            ) : (
              /* Cash / General Payment Status */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  marginBottom: '12px',
                }}>
                  <Banknote size={28} />
                </div>

                <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
                  Pembayaran Tunai di Meja Kasir
                </div>

                {data.uangDiterima > 0 ? (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px 18px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Uang Diterima:</span>
                      <span style={{ fontWeight: 700 }}>Rp{data.uangDiterima.toLocaleString('id-ID')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 800 }}>
                      <span>Kembalian:</span>
                      <span>Rp{data.kembalian.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                    Silakan serahkan uang tunai pas atau sesuai nominal belanja kepada kasir kami.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer Branding */}
      <footer style={{
        padding: '12px 24px',
        backgroundColor: '#f1ece4',
        borderTop: '1px solid #e7dfd5',
        textAlign: 'center',
        fontSize: '12px',
        color: '#78350f',
        fontWeight: 600,
      }}>
        Terima kasih telah mengunjungi Lumbung Kopi dan Roti • Semoga hari Anda menyenangkan! ☕🥐
      </footer>

      {/* Full-Screen Thank You & CSAT Rating Modal Overlay upon Checkout */}
      {showThankYouMode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(69, 26, 3, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '24px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            padding: '36px 32px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            border: '2px solid #fde68a',
          }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              boxShadow: '0 8px 20px rgba(5, 150, 105, 0.2)',
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', margin: 0 }}>
              Pembayaran Berhasil!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Terima kasih telah berkunjung ke <strong style={{ color: '#78350f' }}>{data.cabangNama}</strong>.
            </p>
            {data.lastCompletedStruk && (
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#475569',
                backgroundColor: '#f1f5f9',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}>
                No. Struk: {data.lastCompletedStruk}
              </div>
            )}

            {/* CSAT 3 Points Interactive Rating Card */}
            <div style={{
              marginTop: '10px',
              padding: '20px',
              backgroundColor: '#fdfbf7',
              border: '1.5px solid #f3ece4',
              borderRadius: '18px',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {!ratingSubmitted ? (
                <>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#451a03', margin: '0 0 14px 0' }}>
                    Bagaimana pengalaman pelayanan kasir kami hari ini?
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {/* Option 1: Puas / Sangat Baik */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('baik')}
                      style={{
                        padding: '16px 8px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #bbf7d0',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.1)',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span style={{ fontSize: '38px' }}>😊</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#166534' }}>
                        Puas
                      </span>
                      <span style={{ fontSize: '10px', color: '#15803d', fontWeight: 600 }}>
                        Sangat Baik
                      </span>
                    </button>

                    {/* Option 2: Cukup / Sedang */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('sedang')}
                      style={{
                        padding: '16px 8px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #fde68a',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(245, 158, 11, 0.1)',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span style={{ fontSize: '38px' }}>😐</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
                        Cukup
                      </span>
                      <span style={{ fontSize: '10px', color: '#b45309', fontWeight: 600 }}>
                        Biasa Saja
                      </span>
                    </button>

                    {/* Option 3: Kurang / Buruk */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('buruk')}
                      style={{
                        padding: '16px 8px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #fecaca',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.1)',
                        transition: 'transform 0.15s ease',
                      }}
                      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span style={{ fontSize: '38px' }}>😞</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#991b1b' }}>
                        Kurang
                      </span>
                      <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 600 }}>
                        Perlu Perbaikan
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                /* Post-rating acknowledgment */
                <div style={{
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{ fontSize: '36px' }}>
                    {selectedRating === 'baik' ? '🌟' : selectedRating === 'sedang' ? '👍' : '🙏'}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                    Terima Kasih atas Penilaian Anda!
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    Masukan Anda sangat berharga untuk terus menyempurnakan kehangatan layanan Lumbung Kopi dan Roti.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mayar.id Dynamic QRIS Spotlight Modal on Customer Display */}
      {data.mayarModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150,
          padding: '24px',
          animation: 'fadeIn 0.25s ease',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '460px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            {/* Header Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              fontSize: '11px',
              fontWeight: 800,
              marginBottom: '10px',
              border: '1px solid #bae6fd',
            }}>
              <ShieldCheck size={14} />
              <span>MAYAR.ID PAYMENT GATEWAY</span>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', textAlign: 'center', margin: '0 0 6px 0' }}>
              QRIS Dinamis Otomatis
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', margin: '0 0 18px 0', lineHeight: 1.4 }}>
              Scan dengan BCA Mobile, Mandiri Livin, GoPay, OVO, ShopeePay, DANA atau aplikasi QRIS apa saja
            </p>

            {/* Total Amount Box */}
            <div style={{
              width: '100%',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '18px',
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Total Tagihan</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#0284c7' }}>
                  Rp{(data.mayarAmount || data.total).toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>ID Transaksi</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                  {data.mayarPaymentId || 'Menghubungkan...'}
                </span>
              </div>
            </div>

            {/* Dynamic QR Display */}
            <div style={{
              padding: '14px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '2px dashed #0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(2, 132, 199, 0.1)',
            }}>
              <img
                src={data.mayarQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`00020101021226680016ID.MAYAR.WWW01189360091100200000020215MYR-LUMBUNG520458125303360540${data.total}5802ID5918LUMBUNG+KOPI+ROTI6007JAKARTA6304ABCD`)}`}
                alt="QRIS Mayar.id Dinamis"
                style={{ width: '220px', height: '220px', display: 'block', borderRadius: '10px' }}
              />
            </div>

            {/* Timer and Realtime Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '14px',
              fontSize: '12px',
              color: '#64748b',
              fontWeight: 600,
            }}>
              <Clock size={14} color="#0284c7" />
              <span>Berlaku 15:00 menit • Webhook Auto-Detect</span>
            </div>

            {/* Pulsing Status Indicator */}
            <div style={{
              marginTop: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '30px',
              color: '#166534',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                display: 'inline-block',
                boxShadow: '0 0 8px #22c55e',
              }} />
              <span>Silakan scan QRIS di atas untuk menyelesaikan pembayaran</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomerDisplayView;
