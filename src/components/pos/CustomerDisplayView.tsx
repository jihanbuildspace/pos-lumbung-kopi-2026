import React, { useState, useEffect, useMemo } from 'react';
import {
  subscribeCustomerDisplay,
  type CustomerDisplayPayload,
} from '../../lib/customerDisplayService';
import {
  Coffee,
  QrCode,
  Banknote,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Utensils,
  Maximize2,
  Minimize,
  Star,
  Award,
  Flame,
  Check,
  Store,
} from 'lucide-react';

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
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Rating & Thank You Modal State
  const [showThankYouMode, setShowThankYouMode] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<'sangat_puas' | 'baik' | 'sedang' | 'buruk' | null>(null);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);

  // Real-time clock & formatted date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic greeting based on hour
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      return {
        icon: '🌅',
        headline: 'Selamat Pagi!',
        sub: 'Awali harimu dengan aroma seduhan kopi hangat & roti baru dipanggang.',
      };
    } else if (hour >= 11 && hour < 15) {
      return {
        icon: '☀️',
        headline: 'Selamat Siang!',
        sub: 'Segarkan semangat dengan racikan kopi pilihan & pastry renyah khas Lumbung.',
      };
    } else if (hour >= 15 && hour < 18) {
      return {
        icon: '☕',
        headline: 'Selamat Sore!',
        sub: 'Waktu santai terbaik untuk menikmati secangkir artisan coffee & kue lembut.',
      };
    } else {
      return {
        icon: '🌙',
        headline: 'Selamat Malam!',
        sub: 'Nikmati suasana hangat, tenang, dan kelezatan hidangan penutup istimewa.',
      };
    }
  }, []);

  // Subscribe to cashier broadcast
  useEffect(() => {
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

  // Auto-close thank you overlay after 8 seconds
  useEffect(() => {
    let timer: any;
    if (showThankYouMode && !ratingSubmitted) {
      timer = setTimeout(() => {
        setShowThankYouMode(false);
        setRatingSubmitted(false);
        setSelectedRating(null);
      }, 8000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showThankYouMode, ratingSubmitted]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleSelectRating = (rating: 'sangat_puas' | 'baik' | 'sedang' | 'buruk') => {
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

    // Auto-return to idle welcome screen after 1.8 seconds
    setTimeout(() => {
      setShowThankYouMode(false);
      setRatingSubmitted(false);
      setSelectedRating(null);
    }, 1800);
  };

  // Helper to categorize item by name for aesthetic badge
  const getItemBadge = (nama: string) => {
    const lower = (nama || '').toLowerCase();
    if (lower.includes('kopi') || lower.includes('espresso') || lower.includes('latte') || lower.includes('americano') || lower.includes('cappuccino') || lower.includes('brew')) {
      return { tag: 'Kopi Racikan', icon: '☕', bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
    }
    if (lower.includes('teh') || lower.includes('tea') || lower.includes('matcha') || lower.includes('cokelat') || lower.includes('chocolate') || lower.includes('red velvet')) {
      return { tag: 'Non Kopi', icon: '🍵', bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
    }
    if (lower.includes('roti') || lower.includes('croissant') || lower.includes('danish') || lower.includes('toast') || lower.includes('pastry')) {
      return { tag: 'Fresh Bakery', icon: '🥐', bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' };
    }
    if (lower.includes('cookie') || lower.includes('snack') || lower.includes('donat') || lower.includes('cake') || lower.includes('brownie')) {
      return { tag: 'Kudapan', icon: '🍪', bg: '#fdf4ff', text: '#86198f', border: '#f5d0fe' };
    }
    return { tag: 'Produk Retail', icon: '📦', bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
  };

  const hasItems = data.items && data.items.length > 0;
  const totalItemQty = hasItems ? data.items.reduce((acc, curr) => acc + curr.jumlah, 0) : 0;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Component Styles & Animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim-fade-in {
          animation: fadeInScale 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Top Artisan Coffee Bar Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1f0c03 0%, #3a1603 50%, #451a03 100%)',
        color: '#ffffff',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 24px rgba(31, 12, 3, 0.45)',
        borderBottom: '2px solid #b45309',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Brand & Cabang Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #78350f 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(180, 83, 9, 0.45), inset 0 1px 1px rgba(255,255,255,0.3)',
            animation: 'subtleFloat 3s ease-in-out infinite',
            flexShrink: 0,
          }}>
            <Coffee size={26} color="#fde68a" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{
                fontSize: '19px',
                fontWeight: 900,
                letterSpacing: '0.8px',
                margin: 0,
                color: '#ffffff',
                textTransform: 'uppercase',
              }}>
                LUMBUNG KOPI DAN ROTI
              </h1>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                backgroundColor: 'rgba(253, 230, 138, 0.15)',
                color: '#fde68a',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(253, 230, 138, 0.3)',
                letterSpacing: '0.5px',
              }}>
                CUSTOMER DISPLAY
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
              <span style={{
                fontSize: '12px',
                color: '#fed7aa',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <Store size={13} color="#fde68a" />
                {data.cabangNama || 'Kedai Kopi & Toko Roti'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>•</span>
              <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 500 }}>
                {currentDate}
              </span>
            </div>
          </div>
        </div>

        {/* Live Status, Clock & Fullscreen Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Test Demo Button for Pembayaran Berhasil */}
          <button
            type="button"
            onClick={() => {
              setShowThankYouMode(true);
              setRatingSubmitted(false);
              setSelectedRating(null);
            }}
            title="Klik untuk melihat simulasi layar Pembayaran Berhasil"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '6px 13px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <CheckCircle2 size={14} />
            <span>Tes Simulasi Berhasil ✅</span>
          </button>

          {/* Synchronized Live Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#6ee7b7',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981',
              display: 'inline-block',
              animation: 'pulseGlow 1.8s infinite',
            }} />
            <span>Kasir Terhubung</span>
          </div>

          {/* Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#fde68a',
            fontWeight: 800,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            padding: '6px 12px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: 'monospace',
          }}>
            <Clock size={15} />
            <span>{currentTime}</span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (F11)'}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: hasItems ? '1.45fr 1fr' : '1fr',
        padding: '20px 24px',
        gap: '20px',
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}>
        {/* ================= LEFT COLUMN: ORDER ITEMS OR IDLE WELCOME ================= */}
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: '480px',
        }}>
          {hasItems ? (
            <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Active Order Banner Header */}
              <div style={{
                paddingBottom: '16px',
                borderBottom: '2px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Order Type Badge */}
                    <span style={{
                      backgroundColor: data.tipePesanan === 'takeaway' ? '#fff7ed' : '#ecfdf5',
                      color: data.tipePesanan === 'takeaway' ? '#c2410c' : '#047857',
                      border: `1.5px solid ${data.tipePesanan === 'takeaway' ? '#fed7aa' : '#a7f3d0'}`,
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}>
                      {data.tipePesanan === 'takeaway' ? (
                        <>
                          <ShoppingBag size={14} />
                          <span>Bawa Pulang (Takeaway)</span>
                        </>
                      ) : (
                        <>
                          <Utensils size={14} />
                          <span>Makan di Tempat (Dine-In)</span>
                        </>
                      )}
                    </span>

                    {/* Customer Name */}
                    {data.namaPelanggan ? (
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: '#78350f',
                        backgroundColor: '#fef3c7',
                        border: '1.5px solid #fde68a',
                        padding: '4px 12px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <span>🏷️ Pelanggan:</span>
                        <strong>{data.namaPelanggan}</strong>
                      </span>
                    ) : null}
                  </div>

                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: 900,
                    color: '#0f172a',
                    margin: '4px 0 0 0',
                    letterSpacing: '-0.3px',
                  }}>
                    Rincian Pesanan Anda
                  </h2>
                </div>

                <div style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#78350f',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  textAlign: 'right',
                }}>
                  <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', color: '#92400e', fontWeight: 700 }}>
                    Total Item
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 900 }}>
                    {totalItemQty} Porsi
                  </span>
                </div>
              </div>

              {/* Items List with Artisan Badges */}
              <div
                className="custom-scrollbar"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px 4px 10px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {data.items.map((item, idx) => {
                  const badge = getItemBadge(item.nama);
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.18s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#fafafa';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Left: Quantity + Title + Category Pill */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '15px',
                          fontWeight: 900,
                          flexShrink: 0,
                          boxShadow: '0 4px 10px rgba(120, 53, 15, 0.25)',
                        }}>
                          {item.jumlah}x
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                              {item.nama}
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: badge.bg,
                              color: badge.text,
                              border: `1px solid ${badge.border}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              <span>{badge.icon}</span>
                              <span>{badge.tag}</span>
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                            Rp{item.harga_satuan.toLocaleString('id-ID')} / porsi
                          </div>
                        </div>
                      </div>

                      {/* Right: Subtotal */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#78350f', letterSpacing: '-0.3px' }}>
                          Rp{item.subtotal.toLocaleString('id-ID')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                          Subtotal item
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Notification on Order Screen */}
              <div style={{
                marginTop: '12px',
                padding: '10px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#64748b',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#b45309" />
                  <span>Pastikan pesanan Anda sudah sesuai sebelum melakukan pembayaran.</span>
                </span>
                <span style={{ fontWeight: 700, color: '#78350f' }}>
                  {data.cabangNama}
                </span>
              </div>
            </div>
          ) : (
            /* ================= IDLE STATE: ARTISAN LUXURY WELCOME SHOWCASE ================= */
            <div className="anim-fade-in" style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '24px 20px',
            }}>
              {/* Glowing Hero Icon */}
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '26px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                border: '2px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 12px 28px rgba(180, 83, 9, 0.15)',
                animation: 'subtleFloat 3.5s ease-in-out infinite',
              }}>
                <Coffee size={44} color="#78350f" />
              </div>

              {/* Greeting Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                backgroundColor: '#fef3c7',
                border: '1.5px solid #fde68a',
                color: '#92400e',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '10px',
                letterSpacing: '0.4px',
              }}>
                <span>{timeGreeting.icon}</span>
                <span>{timeGreeting.headline}</span>
              </div>

              <h2 style={{
                fontSize: '30px',
                fontWeight: 900,
                color: '#1e0d04',
                margin: '0 0 8px 0',
                letterSpacing: '-0.5px',
              }}>
                Selamat Datang di Lumbung Kopi
              </h2>

              <p style={{
                fontSize: '14px',
                color: '#64748b',
                maxWidth: '520px',
                margin: '0 auto 28px auto',
                lineHeight: 1.6,
                fontWeight: 500,
              }}>
                {timeGreeting.sub} Silakan sebutkan pesanan Anda kepada kasir kami, dan rincian transaksi Anda akan tampil di layar ini secara langsung.
              </p>

              {/* 4 Feature Value Pillars */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
                width: '100%',
                maxWidth: '960px',
                marginBottom: '28px',
              }}>
                <div style={{
                  padding: '16px 14px',
                  backgroundColor: '#fffbeb',
                  borderRadius: '16px',
                  border: '1.5px solid #fef3c7',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>☕</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
                    100% Biji Arabika
                  </div>
                  <div style={{ fontSize: '11px', color: '#b45309', marginTop: '2px', lineHeight: 1.4 }}>
                    Disangrai fresh & diracik barista ahli
                  </div>
                </div>

                <div style={{
                  padding: '16px 14px',
                  backgroundColor: '#fff7ed',
                  borderRadius: '16px',
                  border: '1.5px solid #ffedd5',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🥐</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#9a3412' }}>
                    Fresh Oven-Baked
                  </div>
                  <div style={{ fontSize: '11px', color: '#c2410c', marginTop: '2px', lineHeight: 1.4 }}>
                    Dipanggang setiap pagi hangat & renyah
                  </div>
                </div>

                <div style={{
                  padding: '16px 14px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '16px',
                  border: '1.5px solid #dcfce7',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>⚡</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#166534' }}>
                    QRIS & Tunai
                  </div>
                  <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px', lineHeight: 1.4 }}>
                    Mendukung semua bank & e-wallet
                  </div>
                </div>

                <div style={{
                  padding: '16px 14px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '16px',
                  border: '1.5px solid #dbeafe',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>✨</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e40af' }}>
                    Bahan Pilihan
                  </div>
                  <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '2px', lineHeight: 1.4 }}>
                    100% butter Prancis & bahan alami
                  </div>
                </div>
              </div>

              {/* Recommended Menu Showcase Row */}
              <div style={{
                width: '100%',
                maxWidth: '960px',
                padding: '18px 22px',
                backgroundColor: '#f8fafc',
                borderRadius: '18px',
                border: '1.5px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Flame size={16} color="#ea580c" />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Rekomendasi Favorit Hari Ini
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                    Kopi Susu Gula Aren + Croissant Mentega Hangat
                  </div>
                </div>

                <div style={{
                  padding: '6px 16px',
                  backgroundColor: '#78350f',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(120, 53, 15, 0.25)',
                }}>
                  Spesial Kedai
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ================= RIGHT COLUMN: BILLING & PAYMENT SPOTLIGHT ================= */}
        {hasItems && (
          <section className="anim-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}>
            {/* 1. Ultra-Luxurious Billing Card */}
            <div style={{
              background: 'linear-gradient(145deg, #1f0c03 0%, #3a1603 50%, #451a03 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              padding: '24px 26px',
              boxShadow: '0 12px 30px rgba(31, 12, 3, 0.35)',
              border: '2px solid #b45309',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Subtle background glow effect */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#fde68a',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  Ringkasan Pembayaran
                </span>
                <span style={{
                  fontSize: '11px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  color: '#f8fafc',
                  fontWeight: 600,
                }}>
                  Resmi • Struk Tercatat
                </span>
              </div>

              {/* Subtotal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#fed7aa' }}>
                <span>Subtotal ({totalItemQty} item)</span>
                <span style={{ fontWeight: 800, color: '#ffffff' }}>
                  Rp{data.subtotal.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Discount (if applicable) */}
              {data.diskon > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  color: '#fca5a5',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                    <Sparkles size={14} color="#fca5a5" />
                    <span>Potongan Diskon (Maks. 10%)</span>
                  </span>
                  <span style={{ fontWeight: 900, color: '#fef2f2' }}>
                    -Rp{data.diskon.toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {/* Big Grand Total */}
              <div style={{
                marginTop: '4px',
                paddingTop: '16px',
                borderTop: '1px dashed rgba(253, 230, 138, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>
                  Total yang Harus Dibayar:
                </span>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#fde68a',
                  letterSpacing: '-1px',
                  lineHeight: 1.1,
                  textShadow: '0 2px 10px rgba(253, 230, 138, 0.2)',
                }}>
                  Rp{data.total.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* 2. Payment Method Presentation Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0,0,0,0.03)',
              border: '1.5px solid #e2e8f0',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              minHeight: '340px',
            }}>
              {data.metodeBayar === 'qris' ? (
                /* ================= AUTHENTIC INDONESIAN QRIS PRESENTATION ================= */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  {/* National QRIS Standard Card Frame */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '2px solid #dc2626',
                    boxShadow: '0 12px 28px rgba(220, 38, 38, 0.12)',
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: '300px',
                  }}>
                    {/* QRIS Red & White Header */}
                    <div style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px' }}>QRIS</span>
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Standar Nasional
                      </span>
                    </div>

                    {/* Merchant Info */}
                    <div style={{ padding: '10px 14px 6px 14px', backgroundColor: '#fef2f2', borderBottom: '1px solid #fee2e2' }}>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#991b1b' }}>
                        LUMBUNG KOPI DAN ROTI
                      </div>
                      <div style={{ fontSize: '10px', color: '#b91c1c', fontWeight: 600 }}>
                        {data.cabangNama} • NMID: ID102458921820
                      </div>
                    </div>

                    {/* High-Resolution QR Code */}
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                      <div style={{
                        padding: '10px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                      }}>
                        <img
                          src={data.mayarQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=2&data=${encodeURIComponent(`00020101021226680016ID.MAYAR.WWW01189360091100200000020215MYR-LUMBUNG520458125303360540${data.total}5802ID5918LUMBUNG+KOPI+ROTI6007JAKARTA6304ABCD`)}`}
                          alt="QRIS Dinamis Lumbung Kopi"
                          style={{ width: '180px', height: '180px', display: 'block', borderRadius: '4px' }}
                        />
                      </div>
                    </div>

                    {/* Exact Nominal Display */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '10px 14px',
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Nominal Tagihan:</span>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#dc2626' }}>
                        Rp{data.total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Supported Payment Logos */}
                  <div style={{
                    marginTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}>
                    {['BCA', 'Mandiri', 'GoPay', 'OVO', 'ShopeePay', 'DANA'].map((app, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>

                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '10px', lineHeight: 1.4, maxWidth: '280px' }}>
                    Arahkan kamera aplikasi bank atau e-wallet ke kode QRIS di atas untuk menyelesaikan transaksi secara instan.
                  </p>
                </div>
              ) : (
                /* ================= CASH PAYMENT PRESENTATION ================= */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    border: '2px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    marginBottom: '16px',
                    boxShadow: '0 8px 18px rgba(5, 150, 105, 0.15)',
                  }}>
                    <Banknote size={36} />
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    Pembayaran Tunai di Kasir
                  </h3>

                  {data.uangDiterima > 0 ? (
                    <div style={{
                      marginTop: '16px',
                      padding: '16px 20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1.5px solid #e2e8f0',
                      width: '100%',
                      maxWidth: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Uang Tunai Diterima:</span>
                        <span style={{ fontWeight: 800, color: '#1e293b' }}>
                          Rp{data.uangDiterima.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        paddingTop: '8px',
                        borderTop: '1px dashed #cbd5e1',
                      }}>
                        <span style={{ color: '#059669', fontWeight: 800, fontSize: '14px' }}>
                          Kembalian:
                        </span>
                        <span style={{ fontSize: '22px', fontWeight: 900, color: '#059669' }}>
                          Rp{data.kembalian.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      marginTop: '16px',
                      padding: '14px 18px',
                      backgroundColor: '#fdfbf7',
                      border: '1.5px dashed #fde68a',
                      borderRadius: '14px',
                      maxWidth: '300px',
                    }}>
                      <p style={{ fontSize: '13px', color: '#92400e', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                        💵 Silakan serahkan uang tunai sebesar <strong>Rp{data.total.toLocaleString('id-ID')}</strong> kepada kasir kami.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Ticker Marquee Bottom Bar */}
      <div style={{
        backgroundColor: '#451a03',
        color: '#fde68a',
        padding: '8px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderTop: '1px solid #78350f',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.5px',
      }}>
        <div style={{
          display: 'inline-block',
          paddingLeft: '100%',
          animation: 'marqueeScroll 26s linear infinite',
        }}>
          ✨ SELAMAT DATANG DI LUMBUNG KOPI DAN ROTI • SEMUA PRODUK ROTI DAN MINUMAN DIBUAT DENGAN BAHAN PILIHAN HIGIENIS • MENERIMA PEMBAYARAN TUNAI DAN QRIS SEMUA BANK & E-WALLET • TERIMA KASIH ATAS KUNJUNGAN ANDA ✨
        </div>
      </div>

      {/* Footer Branding */}
      <footer style={{
        padding: '12px 28px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        fontWeight: 600,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>Sistem Kasir Pintar Lumbung POS • Struk Terstandarisasi BR-04</span>
        </div>
        <div style={{ color: '#78350f', fontWeight: 700 }}>
          Semoga Hari Anda Menyenangkan! ☕🥐
        </div>
      </footer>

      {/* ================= FULL-SCREEN CELEBRATORY CSAT RATING MODAL OVERLAY ================= */}
      {showThankYouMode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '24px',
          animation: 'fadeInScale 0.25s ease',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            maxWidth: '580px',
            width: '100%',
            padding: '40px 36px',
            textAlign: 'center',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            border: '2px solid #fde68a',
            position: 'relative',
          }}>
            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setShowThankYouMode(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 700,
              }}
              title="Tutup Layar"
            >
              ✕
            </button>

            {/* Success Glowing Checkmark Icon */}
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 12px 32px rgba(16, 185, 129, 0.45)',
              animation: 'pulseGlow 2s infinite',
            }}>
              <CheckCircle2 size={54} strokeWidth={2.5} />
            </div>

            {/* Status Lunas Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 16px',
              borderRadius: '9999px',
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              color: '#065f46',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}>
              <Check size={14} strokeWidth={3} />
              <span>TRANSAKSI LUNAS • STRUK TERCATAT</span>
            </div>

            {/* Main Headline */}
            <h2 style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#0f172a',
              margin: '2px 0 0 0',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>Pembayaran Berhasil!</span>
              <span style={{ color: '#10b981' }}>✅</span>
            </h2>

            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.5, maxWidth: '440px' }}>
              Terima kasih telah berkunjung ke <strong style={{ color: '#78350f' }}>{data.cabangNama}</strong>. Pesanan Anda segera disiapkan dengan sepenuh hati.
            </p>

            {/* Transaction Details Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              marginTop: '4px',
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: 800,
                color: '#78350f',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                padding: '4px 14px',
                borderRadius: '8px',
              }}>
                Total: Rp{(data.total || 45000).toLocaleString('id-ID')}
              </span>

              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#334155',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                padding: '4px 14px',
                borderRadius: '8px',
                fontFamily: 'monospace',
              }}>
                No. Struk: {data.lastCompletedStruk || 'TBT-20261027-0005'}
              </span>
            </div>

            {/* CSAT 4-Level Interactive Rating Card */}
            <div style={{
              marginTop: '12px',
              padding: '22px',
              backgroundColor: '#fdfbf7',
              border: '1.5px solid #f3ece4',
              borderRadius: '20px',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {!ratingSubmitted ? (
                <>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#451a03', margin: '0 0 16px 0' }}>
                    Bagaimana pengalaman pelayanan kami hari ini?
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {/* Option 1: Sangat Puas */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('sangat_puas')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #bbf7d0',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>🤩</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>
                        Istimewa
                      </span>
                      <span style={{ fontSize: '9px', color: '#15803d', fontWeight: 600 }}>
                        Sangat Puas
                      </span>
                    </button>

                    {/* Option 2: Puas */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('baik')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #bbf7d0',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>😊</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>
                        Puas
                      </span>
                      <span style={{ fontSize: '9px', color: '#166534', fontWeight: 600 }}>
                        Pelayanan Baik
                      </span>
                    </button>

                    {/* Option 3: Cukup */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('sedang')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #fde68a',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>😐</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>
                        Cukup
                      </span>
                      <span style={{ fontSize: '9px', color: '#b45309', fontWeight: 600 }}>
                        Biasa Saja
                      </span>
                    </button>

                    {/* Option 4: Kurang */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('buruk')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #fecaca',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>😞</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#991b1b' }}>
                        Kurang
                      </span>
                      <span style={{ fontSize: '9px', color: '#dc2626', fontWeight: 600 }}>
                        Perlu Evaluasi
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                /* Post-rating acknowledgment */
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{ fontSize: '42px', animation: 'subtleFloat 1s infinite' }}>
                    {selectedRating === 'sangat_puas' ? '🎉' : selectedRating === 'baik' ? '🌟' : selectedRating === 'sedang' ? '👍' : '🙏'}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                    Terima Kasih atas Penilaian Anda!
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                    Masukan Anda sangat berharga untuk terus menyempurnakan kehangatan layanan Lumbung Kopi dan Roti.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MAYAR.ID DYNAMIC QRIS SPOTLIGHT MODAL ================= */}
      {data.mayarModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150,
          padding: '24px',
          animation: 'fadeInScale 0.25s ease',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '26px',
            width: '100%',
            maxWidth: '480px',
            padding: '30px',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.45)',
            border: '2px solid #e0f2fe',
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
              padding: '5px 16px',
              borderRadius: '20px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              fontSize: '11px',
              fontWeight: 800,
              marginBottom: '12px',
              border: '1px solid #bae6fd',
              letterSpacing: '0.5px',
            }}>
              <ShieldCheck size={14} />
              <span>MAYAR.ID PAYMENT GATEWAY</span>
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', textAlign: 'center', margin: '0 0 6px 0' }}>
              QRIS Dinamis Terverifikasi
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', margin: '0 0 20px 0', lineHeight: 1.4 }}>
              Buka aplikasi BCA Mobile, Mandiri Livin, GoPay, OVO, ShopeePay, DANA atau mobile banking Anda
            </p>

            {/* Total Amount Box */}
            <div style={{
              width: '100%',
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Total Tagihan</span>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#0284c7' }}>
                  Rp{(data.mayarAmount || data.total).toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>ID Transaksi</span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 800, color: '#334155' }}>
                  {data.mayarPaymentId || 'Menghubungkan...'}
                </span>
              </div>
            </div>

            {/* Dynamic QR Display */}
            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '2px dashed #0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.12)',
            }}>
              <img
                src={data.mayarQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(`00020101021226680016ID.MAYAR.WWW01189360091100200000020215MYR-LUMBUNG520458125303360540${data.total}5802ID5918LUMBUNG+KOPI+ROTI6007JAKARTA6304ABCD`)}`}
                alt="QRIS Mayar.id Dinamis"
                style={{ width: '220px', height: '220px', display: 'block', borderRadius: '12px' }}
              />
            </div>

            {/* Realtime Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '16px',
              fontSize: '12px',
              color: '#64748b',
              fontWeight: 600,
            }}>
              <Clock size={15} color="#0284c7" />
              <span>Berlaku 15:00 menit • Deteksi Otomatis Real-time</span>
            </div>

            {/* Pulsing Status Indicator */}
            <div style={{
              marginTop: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
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
                boxShadow: '0 0 10px #22c55e',
              }} />
              <span>Menunggu pembayaran pelanggan...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDisplayView;
