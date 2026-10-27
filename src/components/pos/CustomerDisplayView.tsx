import React, { useState, useEffect, useMemo } from 'react';
import {
  subscribeCustomerDisplay,
  type CustomerDisplayPayload,
} from '../../lib/customerDisplayService';
import { SEED_PRODUCTS } from '../../lib/seedData';
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
  Flame,
  Check,
  Store,
  Wifi,
  Tag,
  Leaf,
  ChevronRight,
  Smile,
  Heart,
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
        sub: 'Awali pagimu dengan seduhan kopi hangat & roti mentega baru keluar dari oven.',
      };
    } else if (hour >= 11 && hour < 15) {
      return {
        icon: '☀️',
        headline: 'Selamat Siang!',
        sub: 'Segarkan harimu dengan es kopi susu racikan barista & pastry renyah.',
      };
    } else if (hour >= 15 && hour < 18) {
      return {
        icon: '☕',
        headline: 'Selamat Sore!',
        sub: 'Waktu santai terbaik menikmati secangkir manual brew & kudapan manis.',
      };
    } else {
      return {
        icon: '🌙',
        headline: 'Selamat Malam!',
        sub: 'Nikmati suasana hangat, tenang, dan aneka hidangan penutup istimewa kami.',
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
      return { tag: 'Kopi Racikan', icon: '☕', bg: 'rgba(217, 119, 6, 0.2)', text: '#fde68a', border: 'rgba(253, 230, 138, 0.35)' };
    }
    if (lower.includes('teh') || lower.includes('tea') || lower.includes('matcha') || lower.includes('cokelat') || lower.includes('chocolate') || lower.includes('red velvet')) {
      return { tag: 'Non Kopi', icon: '🍵', bg: 'rgba(16, 185, 129, 0.2)', text: '#a7f3d0', border: 'rgba(167, 243, 208, 0.35)' };
    }
    if (lower.includes('roti') || lower.includes('croissant') || lower.includes('danish') || lower.includes('toast') || lower.includes('pastry')) {
      return { tag: 'Fresh Bakery', icon: '🥐', bg: 'rgba(234, 88, 12, 0.2)', text: '#fed7aa', border: 'rgba(254, 215, 170, 0.35)' };
    }
    if (lower.includes('cookie') || lower.includes('snack') || lower.includes('donat') || lower.includes('cake') || lower.includes('brownie')) {
      return { tag: 'Kudapan', icon: '🍪', bg: 'rgba(217, 70, 239, 0.2)', text: '#f5d0fe', border: 'rgba(245, 208, 254, 0.35)' };
    }
    return { tag: 'Produk Retail', icon: '📦', bg: 'rgba(148, 163, 184, 0.2)', text: '#e2e8f0', border: 'rgba(226, 232, 240, 0.3)' };
  };

  const hasItems = data.items && data.items.length > 0;
  const totalItemQty = hasItems ? data.items.reduce((acc, curr) => acc + curr.jumlah, 0) : 0;

  // Active Category Filter for Idle Menu Board
  const [activeMenuTab, setActiveMenuTab] = useState<'semua' | 'kopi' | 'roti' | 'non_kopi' | 'snack' | 'kemasan'>('semua');

  // Official Products from Lumbung Kopi dan Roti (100% Sesuai PRD & Database)
  const officialProducts = useMemo(() => {
    return SEED_PRODUCTS.filter((p) => p.aktif).map((p) => {
      let highlight = 'Menu Pilihan';
      let desc = 'Sajian resmi Lumbung Kopi dan Roti';
      let icon = '☕';

      if (p.sku === 'KOP-003') {
        highlight = '🔥 Best Seller';
        desc = 'Espresso racikan khas Lumbung dengan susu segar';
        icon = '☕';
      } else if (p.sku === 'KOP-001') {
        highlight = '☕ Single Shot';
        desc = 'Ekstraksi murni biji kopi Arabika pilihan';
        icon = '☕';
      } else if (p.sku === 'KOP-002') {
        highlight = '☕ Seduhan Hitam';
        desc = 'Espresso dengan air panas cita rasa bersih';
        icon = '☕';
      } else if (p.sku === 'KOP-004') {
        highlight = '☕ Foam Tebal';
        desc = 'Espresso dengan steamed milk dan busa lembut';
        icon = '☕';
      } else if (p.sku === 'KOP-005') {
        highlight = '⭐ Pilihan Barista';
        desc = 'Paduan lembut espresso dan susu segar hangat/dingin';
        icon = '☕';
      } else if (p.sku === 'NKP-001') {
        highlight = '🍵 Favorit Non-Kopi';
        desc = 'Matcha murni berkualitas tinggi dengan susu segar';
        icon = '🍵';
      } else if (p.sku === 'NKP-002') {
        highlight = '🍫 Hangat Menenangkan';
        desc = 'Cokelat premium pekat diseduh lembut';
        icon = '🍫';
      } else if (p.sku === 'NKP-003') {
        highlight = '🫖 Racikan Khas';
        desc = 'Seduhan teh tarik harum berbusa nikmat';
        icon = '🫖';
      } else if (p.sku === 'ROT-001') {
        highlight = '🥐 Fresh Oven';
        desc = 'Pastry renyah berlapis dengan mentega gurih';
        icon = '🥐';
      } else if (p.sku === 'ROT-002') {
        highlight = '🍌 Roti Favorit';
        desc = 'Roti manis empuk isi pisang manis dan cokelat lumer';
        icon = '🍞';
      } else if (p.sku === 'ROT-003') {
        highlight = '🧀 Gurih Lembut';
        desc = 'Roti sobek lembut dengan taburan keju melimpah';
        icon = '🍞';
      } else if (p.sku === 'ROT-004') {
        highlight = '🍩 Klasik Manis';
        desc = 'Donat empuk bertabur gula halus salju';
        icon = '🍩';
      } else if (p.sku === 'SNK-001') {
        highlight = '🍪 Camilan Renyah';
        desc = 'Kue kering oat gandum madu sehat isi 6 pcs';
        icon = '🍪';
      } else if (p.sku === 'SNK-002') {
        highlight = '🍰 Lembut Harum';
        desc = 'Potongan bolu pisang manis dan legit';
        icon = '🍰';
      } else if (p.sku === 'KMS-001') {
        highlight = '📦 Kemasan 1 Liter';
        desc = 'Kopi susu kemasan botol siap simpan di kulkas';
        icon = '📦';
      } else if (p.sku === 'KMS-002') {
        highlight = '☕ Biji Kopi Sangrai';
        desc = 'Biji kopi pilihan kemasan 250 gram siap giling';
        icon = '📦';
      } else if (p.sku === 'KMS-003') {
        highlight = '🎁 Merchandise Resmi';
        desc = 'Tumbler stainless tahan panas & dingin 450 ml';
        icon = '🎁';
      }

      return {
        id: p.id,
        sku: p.sku,
        nama: p.nama,
        kategori: p.kategori,
        harga: p.harga_jual,
        highlight,
        desc,
        icon,
      };
    });
  }, []);

  const filteredMenuCatalog = activeMenuTab === 'semua'
    ? officialProducts
    : officialProducts.filter((m) => m.kategori === activeMenuTab);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0c0704',
      backgroundImage: `
        radial-gradient(circle at 15% 20%, rgba(180, 83, 9, 0.18) 0%, transparent 40%),
        radial-gradient(circle at 85% 75%, rgba(217, 119, 6, 0.12) 0%, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(69, 26, 3, 0.25) 0%, transparent 60%)
      `,
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Plus Jakarta Sans", "Outfit", -apple-system, sans-serif',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Dynamic Keyframe Animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.85; }
        }
        @keyframes floatSubtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim-fade {
          animation: fadeInScale 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glass-panel {
          background: rgba(26, 14, 7, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(253, 230, 138, 0.15);
        }
        .glass-card-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card-item:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(253, 230, 138, 0.3);
          transform: translateY(-2px);
        }
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(253, 230, 138, 0.25);
          border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(253, 230, 138, 0.45);
        }
      `}</style>

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header style={{
        background: 'rgba(15, 8, 4, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(253, 230, 138, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Brand Logo & Branch Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
            border: '1.5px solid rgba(253, 230, 138, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(180, 83, 9, 0.35)',
            animation: 'floatSubtle 3s ease-in-out infinite',
            flexShrink: 0,
          }}>
            <Coffee size={24} color="#fde68a" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '1px',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}>
                LUMBUNG KOPI DAN ROTI
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                backgroundColor: 'rgba(253, 230, 138, 0.15)',
                color: '#fde68a',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(253, 230, 138, 0.3)',
                letterSpacing: '0.6px',
              }}>
                CUSTOMER DISPLAY
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
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
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>•</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                {currentDate}
              </span>
            </div>
          </div>
        </div>

        {/* Status, Time, Test Button & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Quick Demo Preview Button for Pembayaran Berhasil */}
          <button
            type="button"
            onClick={() => {
              setShowThankYouMode(true);
              setRatingSubmitted(false);
              setSelectedRating(null);
            }}
            title="Klik untuk melihat animasi Pembayaran Berhasil!"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              padding: '7px 14px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 800,
              border: '1px solid #34d399',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            <CheckCircle2 size={15} />
            <span>Tes Pembayaran Berhasil ✅</span>
          </button>

          {/* Real-time cashier sync status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '7px 14px',
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
              animation: 'pulseGlow 2s infinite',
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
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '7px 14px',
            borderRadius: '12px',
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
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
      </header>

      {/* ================= MAIN BALANCED TWO-COLUMN STAGE ================= */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.45fr 1fr',
        padding: '24px 28px',
        gap: '24px',
        maxWidth: '1600px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}>
        {/* ---------------- LEFT STAGE (60%): ORDERS OR ARTISAN MENU SHOWCASE ---------------- */}
        <section className="glass-panel" style={{
          borderRadius: '28px',
          padding: '26px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minHeight: '520px',
        }}>
          {hasItems ? (
            /* ACTIVE CART ORDER VIEW */
            <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Active Order Header */}
              <div style={{
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: data.tipePesanan === 'takeaway' ? 'rgba(234, 88, 12, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: data.tipePesanan === 'takeaway' ? '#fed7aa' : '#a7f3d0',
                      border: `1px solid ${data.tipePesanan === 'takeaway' ? 'rgba(234, 88, 12, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
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

                    {data.namaPelanggan ? (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#fde68a',
                        backgroundColor: 'rgba(217, 119, 6, 0.2)',
                        border: '1px solid rgba(253, 230, 138, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '8px',
                      }}>
                        🏷️ Pelanggan: <strong>{data.namaPelanggan}</strong>
                      </span>
                    ) : null}
                  </div>

                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#ffffff',
                    margin: '4px 0 0 0',
                    letterSpacing: '-0.3px',
                  }}>
                    Rincian Pesanan Anda
                  </h2>
                </div>

                <div style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#fde68a',
                  backgroundColor: 'rgba(253, 230, 138, 0.1)',
                  border: '1px solid rgba(253, 230, 138, 0.25)',
                  padding: '8px 16px',
                  borderRadius: '14px',
                  textAlign: 'right',
                }}>
                  <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', color: '#cbd5e1', fontWeight: 600 }}>
                    Total Menu
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900 }}>
                    {totalItemQty} Porsi
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div
                className="custom-scroll"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px 4px 10px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {data.items.map((item, idx) => {
                  const badge = getItemBadge(item.nama);
                  return (
                    <div
                      key={idx}
                      className="glass-card-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderRadius: '18px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 900,
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(180, 83, 9, 0.4)',
                        }}>
                          {item.jumlah}x
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
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

                          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>
                            Rp{item.harga_satuan.toLocaleString('id-ID')} / porsi
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#fde68a', letterSpacing: '-0.3px' }}>
                          Rp{item.subtotal.toLocaleString('id-ID')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Subtotal item
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add-on Pairing Advice at Bottom */}
              <div style={{
                marginTop: '12px',
                padding: '14px 18px',
                borderRadius: '16px',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                border: '1px dashed rgba(253, 230, 138, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>🥐</span>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#fde68a', display: 'block' }}>
                      Rekomendasi Tambahan Hangat:
                    </span>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      Croissant Mentega (+Rp24.000) • Donat Gula Halus (+Rp10.000) • Roti Pisang Cokelat (+Rp18.000)
                    </span>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#fde68a',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(253, 230, 138, 0.2)',
                }}>
                  Tersedia di Meja Kasir
                </span>
              </div>
            </div>
          ) : (
            /* IDLE SCREEN: ARTISAN CAFE SHOWCASE (NO EMPTY SPACE!) */
            <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '18px' }}>
              {/* Dynamic Time Greeting Banner */}
              <div style={{
                padding: '18px 22px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.35) 0%, rgba(69, 26, 3, 0.25) 100%)',
                border: '1px solid rgba(253, 230, 138, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 6px 16px rgba(180, 83, 9, 0.3)',
                  }}>
                    {timeGreeting.icon}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>
                        {timeGreeting.headline} Selamat Datang di Lumbung
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: '#d97706',
                        color: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}>
                        MENU UTAMA
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#fed7aa', margin: '3px 0 0 0', fontWeight: 500 }}>
                      {timeGreeting.sub}
                    </p>
                  </div>
                </div>

                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#fde68a',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(253, 230, 138, 0.2)',
                  whiteSpace: 'nowrap',
                }}>
                  Sampaikan Pesanan Anda 🗣️
                </div>
              </div>

              {/* Category Filter Pills for Menu Board */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={18} color="#f59e0b" />
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Koleksi Menu Pilihan &amp; Signature
                  </span>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'semua', label: 'Semua Menu' },
                    { key: 'kopi', label: '☕ Kopi' },
                    { key: 'roti', label: '🥐 Roti' },
                    { key: 'non_kopi', label: '🍵 Non Kopi' },
                    { key: 'snack', label: '🍪 Snack' },
                    { key: 'kemasan', label: '📦 Kemasan' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveMenuTab(tab.key as any)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: activeMenuTab === tab.key ? '#b45309' : 'rgba(255, 255, 255, 0.05)',
                        color: activeMenuTab === tab.key ? '#ffffff' : '#94a3b8',
                        border: `1px solid ${activeMenuTab === tab.key ? '#fde68a' : 'rgba(255, 255, 255, 0.08)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Official Lumbung Menu Catalog Grid (Scrollable) */}
              <div
                className="custom-scroll"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  flex: 1,
                  maxHeight: '430px',
                  overflowY: 'auto',
                  paddingRight: '6px',
                }}
              >
                {filteredMenuCatalog.map((item, i) => (
                  <div
                    key={i}
                    className="glass-card-item"
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '15px' }}>{item.icon}</span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: 'rgba(217, 119, 6, 0.25)',
                          color: '#fde68a',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(253, 230, 138, 0.3)',
                        }}>
                          {item.highlight}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          fontFamily: 'monospace',
                          color: '#94a3b8',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          padding: '2px 5px',
                          borderRadius: '4px',
                        }}>
                          {item.sku}
                        </span>
                      </div>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#fde68a' }}>
                        Rp{item.harga.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                        {item.nama}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Bundle Promo Strip */}
              <div style={{
                padding: '14px 20px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
                border: '1px solid rgba(52, 211, 153, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Tag size={18} color="#34d399" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#a7f3d0' }}>
                    Paket Spesial Lumbung: Kopi Susu Lumbung + Croissant Mentega hanya Rp42.000 (Hemat Rp7.000)
                  </span>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '3px 10px',
                  borderRadius: '6px',
                }}>
                  SETIAP HARI
                </span>
              </div>
            </div>
          )}
        </section>

        {/* ---------------- RIGHT STAGE (40%): BILLING & PAYMENT OR GUEST SERVICES ---------------- */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          {hasItems ? (
            /* ACTIVE BILLING & QRIS TERMINAL */
            <>
              {/* Grand Total Luxury Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1f0c03 0%, #3a1603 60%, #451a03 100%)',
                borderRadius: '28px',
                padding: '26px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.5)',
                border: '2px solid #b45309',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#fde68a',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Ringkasan Tagihan
                  </span>
                  <span style={{
                    fontSize: '11px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    color: '#cbd5e1',
                    fontWeight: 600,
                  }}>
                    Struk Terstandarisasi BR-04
                  </span>
                </div>

                {/* Subtotal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#fed7aa' }}>
                  <span>Subtotal ({totalItemQty} item)</span>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>
                    Rp{data.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Diskon */}
                {data.diskon > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
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

                {/* Big Total */}
                <div style={{
                  marginTop: '4px',
                  paddingTop: '16px',
                  borderTop: '1px dashed rgba(253, 230, 138, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase' }}>
                    Total yang Harus Dibayar:
                  </span>
                  <div style={{
                    fontSize: '38px',
                    fontWeight: 900,
                    color: '#fde68a',
                    letterSpacing: '-1px',
                    lineHeight: 1.1,
                    textShadow: '0 2px 14px rgba(253, 230, 138, 0.25)',
                  }}>
                    Rp{data.total.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Payment Presentation (QRIS vs Tunai) */}
              <div className="glass-panel" style={{
                borderRadius: '28px',
                padding: '24px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '340px',
              }}>
                {data.metodeBayar === 'qris' ? (
                  /* QRIS DISPLAY */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {/* National QRIS Standard Card Frame */}
                    <div style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '22px',
                      border: '2px solid #dc2626',
                      boxShadow: '0 12px 30px rgba(220, 38, 38, 0.2)',
                      overflow: 'hidden',
                      width: '100%',
                      maxWidth: '290px',
                    }}>
                      {/* Header */}
                      <div style={{
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '2px' }}>QRIS</span>
                        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px' }}>STANDAR NASIONAL</span>
                      </div>

                      {/* Merchant */}
                      <div style={{ padding: '8px 14px', backgroundColor: '#fef2f2', borderBottom: '1px solid #fee2e2' }}>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: '#991b1b' }}>
                          LUMBUNG KOPI DAN ROTI
                        </div>
                        <div style={{ fontSize: '10px', color: '#b91c1c' }}>
                          {data.cabangNama} • NMID: ID102458921820
                        </div>
                      </div>

                      {/* QR Code */}
                      <div style={{ padding: '14px', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                        <img
                          src={data.mayarQrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=2&data=${encodeURIComponent(`00020101021226680016ID.MAYAR.WWW01189360091100200000020215MYR-LUMBUNG520458125303360540${data.total}5802ID5918LUMBUNG+KOPI+ROTI6007JAKARTA6304ABCD`)}`}
                          alt="QRIS Dinamis"
                          style={{ width: '170px', height: '170px', display: 'block', borderRadius: '4px' }}
                        />
                      </div>

                      {/* Nominal */}
                      <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '10px 14px',
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Nominal Pas:</span>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: '#dc2626' }}>
                          Rp{data.total.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      flexWrap: 'wrap',
                    }}>
                      {['BCA', 'Mandiri', 'GoPay', 'OVO', 'ShopeePay', 'DANA'].map((app, i) => (
                        <span key={i} style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(255,255,255,0.08)', color: '#f8fafc', padding: '3px 8px', borderRadius: '4px' }}>
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* CASH DISPLAY */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.15) 100%)',
                      border: '1.5px solid rgba(52, 211, 153, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                      marginBottom: '16px',
                      boxShadow: '0 10px 24px rgba(16, 185, 129, 0.25)',
                    }}>
                      <Banknote size={36} />
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                      Pembayaran Tunai di Meja Kasir
                    </h3>

                    {data.uangDiterima > 0 ? (
                      <div style={{
                        marginTop: '16px',
                        padding: '16px 20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        width: '100%',
                        maxWidth: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                          <span style={{ color: '#94a3b8' }}>Uang Tunai Diterima:</span>
                          <span style={{ fontWeight: 800, color: '#ffffff' }}>
                            Rp{data.uangDiterima.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.15)' }}>
                          <span style={{ color: '#34d399', fontWeight: 800, fontSize: '14px' }}>Kembalian:</span>
                          <span style={{ fontSize: '22px', fontWeight: 900, color: '#34d399' }}>
                            Rp{data.kembalian.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '16px', padding: '14px 18px', backgroundColor: 'rgba(217, 119, 6, 0.15)', border: '1px dashed rgba(253, 230, 138, 0.3)', borderRadius: '14px' }}>
                        <p style={{ fontSize: '13px', color: '#fde68a', margin: 0, fontWeight: 600 }}>
                          💵 Silakan serahkan uang tunai Rp{data.total.toLocaleString('id-ID')} kepada kasir kami.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* IDLE SCREEN: GUEST SERVICES & AMBIANCE (Fills the right 40% with high-end cards!) */
            <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              {/* Card 1: Free Guest WiFi Card */}
              <div className="glass-panel" style={{
                borderRadius: '24px',
                padding: '22px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1.5px solid rgba(96, 165, 250, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  flexShrink: 0,
                }}>
                  <Wifi size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Koneksi Tamu Gratis
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: 'rgba(59, 130, 246, 0.25)', color: '#93c5fd', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      100 Mbps
                    </span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                    WiFi: Lumbung-Guest
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    Kata Sandi: <strong style={{ color: '#fde68a', fontFamily: 'monospace' }}>kopihangat2026</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Operating Schedule & Fresh Oven Hours */}
              <div className="glass-panel" style={{
                borderRadius: '24px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#fde68a" />
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Jadwal Operasional Kedai
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: '#94a3b8' }}>Jam Buka:</span>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>07:00 – 22:00 WIB</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: '#94a3b8' }}>Fresh Oven Bake:</span>
                  <span style={{ fontWeight: 800, color: '#fb923c' }}>07:30 &amp; 14:00 WIB</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0' }}>
                  <span style={{ color: '#94a3b8' }}>Penyajian:</span>
                  <span style={{ fontWeight: 800, color: '#34d399' }}>Dine-In &amp; Takeaway</span>
                </div>
              </div>

              {/* Card 3: Payment Acceptance & Quality Statement */}
              <div className="glass-panel" style={{
                borderRadius: '24px',
                padding: '22px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <ShieldCheck size={18} color="#34d399" />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Metode Pembayaran Resmi
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                    Menerima seluruh pembayaran QRIS (semua Bank &amp; E-Wallet nasional) serta pembayaran tunai pas di kasir.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['BCA Mobile', 'Mandiri Livin', 'BRImo', 'GoPay', 'OVO', 'ShopeePay', 'DANA', 'Tunai'].map((app, i) => (
                      <span key={i} style={{ fontSize: '10px', fontWeight: 800, backgroundColor: 'rgba(255,255,255,0.06)', color: '#f8fafc', padding: '4px 9px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '14px',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12px',
                  color: '#a7f3d0',
                }}>
                  <Leaf size={16} color="#34d399" />
                  <span>100% Bahan Halal, Kopi Petani Lokal, Tanpa Pengawet</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Ticker Marquee Bottom Bar */}
      <div style={{
        backgroundColor: '#1a0e07',
        color: '#fde68a',
        padding: '10px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderTop: '1px solid rgba(253, 230, 138, 0.2)',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.6px',
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
        backgroundColor: '#0f0804',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#94a3b8',
        fontWeight: 600,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>Sistem Kasir Pintar Lumbung POS • Struk Terstandarisasi BR-04</span>
        </div>
        <div style={{ color: '#fde68a', fontWeight: 700 }}>
          Semoga Hari Anda Menyenangkan! ☕🥐
        </div>
      </footer>

      {/* ================= CELEBRATION MODAL: PEMBAYARAN BERHASIL ================= */}
      {showThankYouMode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(5, 3, 2, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '24px',
          animation: 'fadeInScale 0.25s ease',
        }}>
          <div style={{
            backgroundColor: '#1a0e07',
            borderRadius: '28px',
            maxWidth: '580px',
            width: '100%',
            padding: '40px 36px',
            textAlign: 'center',
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            border: '2px solid rgba(253, 230, 138, 0.4)',
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
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
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

            {/* Glowing Big Checkmark */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 12px 35px rgba(16, 185, 129, 0.5)',
              animation: 'pulseGlow 2s infinite',
            }}>
              <CheckCircle2 size={56} strokeWidth={2.5} />
            </div>

            {/* Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1.5px solid rgba(52, 211, 153, 0.4)',
              color: '#6ee7b7',
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
              color: '#ffffff',
              margin: '2px 0 0 0',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span>Pembayaran Berhasil!</span>
              <span style={{ color: '#34d399' }}>✅</span>
            </h2>

            <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0, lineHeight: 1.5, maxWidth: '440px' }}>
              Terima kasih telah berkunjung ke <strong style={{ color: '#fde68a' }}>{data.cabangNama}</strong>. Pesanan Anda segera disiapkan dengan sepenuh hati.
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
                color: '#fde68a',
                backgroundColor: 'rgba(217, 119, 6, 0.25)',
                border: '1px solid rgba(253, 230, 138, 0.3)',
                padding: '4px 14px',
                borderRadius: '8px',
              }}>
                Total: Rp{(data.total || 45000).toLocaleString('id-ID')}
              </span>

              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#cbd5e1',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
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
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(253, 230, 138, 0.2)',
              borderRadius: '20px',
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {!ratingSubmitted ? (
                <>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#fde68a', margin: '0 0 16px 0' }}>
                    Bagaimana pengalaman pelayanan kami hari ini?
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {/* Option 1: Sangat Puas */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('sangat_puas')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1.5px solid rgba(52, 211, 153, 0.35)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>🤩</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#6ee7b7' }}>
                        Istimewa
                      </span>
                      <span style={{ fontSize: '9px', color: '#a7f3d0' }}>
                        Sangat Puas
                      </span>
                    </button>

                    {/* Option 2: Puas */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('baik')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1.5px solid rgba(52, 211, 153, 0.35)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>😊</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#6ee7b7' }}>
                        Puas
                      </span>
                      <span style={{ fontSize: '9px', color: '#a7f3d0' }}>
                        Pelayanan Baik
                      </span>
                    </button>

                    {/* Option 3: Cukup */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('sedang')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1.5px solid rgba(251, 191, 36, 0.35)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>😐</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#fde68a' }}>
                        Cukup
                      </span>
                      <span style={{ fontSize: '9px', color: '#fed7aa' }}>
                        Biasa Saja
                      </span>
                    </button>

                    {/* Option 4: Kurang */}
                    <button
                      type="button"
                      onClick={() => handleSelectRating('buruk')}
                      style={{
                        padding: '14px 6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1.5px solid rgba(248, 113, 113, 0.35)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <span style={{ fontSize: '36px' }}>😞</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#fca5a5' }}>
                        Kurang
                      </span>
                      <span style={{ fontSize: '9px', color: '#fecaca' }}>
                        Perlu Evaluasi
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{ fontSize: '42px', animation: 'floatSubtle 1s infinite' }}>
                    {selectedRating === 'sangat_puas' ? '🎉' : selectedRating === 'baik' ? '🌟' : selectedRating === 'sedang' ? '👍' : '🙏'}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>
                    Terima Kasih atas Penilaian Anda!
                  </div>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
                    Masukan Anda sangat berharga untuk terus menyempurnakan kehangatan layanan Lumbung Kopi dan Roti.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDisplayView;
