import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { usePOS } from '../../context/POSContext';
import type { Produk, KategoriProduk } from '../../types/database';
import { SEED_PRODUCTS } from '../../lib/seedData';
import { Search, ShoppingBag, Plus, Minus, Trash2, Tag, QrCode, Banknote, AlertCircle, RefreshCw, Monitor, User, CheckCircle2, ExternalLink, Zap, ShieldCheck, X, Clock, Coffee, Sparkles } from 'lucide-react';
import { createMayarQRIS, type MayarPaymentResponse } from '../../lib/mayarService';
import { broadcastCustomerDisplay } from '../../lib/customerDisplayService';

interface POSViewProps {
  onOpenShiftModal: () => void;
}

export const POSView: React.FC<POSViewProps> = ({ onOpenShiftModal }) => {
  const { cabang, profile } = useAuth();
  const {
    activeShift,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    tipePesanan,
    setTipePesanan,
    namaPelanggan,
    setNamaPelanggan,
    diskon,
    alasanDiskon,
    setDiskonInfo,
    metodeBayar,
    setMetodeBayar,
    uangDiterima,
    setUangDiterima,
    subtotal,
    total,
    kembalian,
    processCheckout,
  } = usePOS();

  const [products, setProducts] = useState<Produk[]>(SEED_PRODUCTS as any);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [checkoutError, setCheckoutError] = useState<string>('');

  // Mayar.id Payment Gateway Modal State
  const [showMayarModal, setShowMayarModal] = useState<boolean>(false);
  const [mayarPaymentData, setMayarPaymentData] = useState<MayarPaymentResponse | null>(null);
  const [mayarLoading, setMayarLoading] = useState<boolean>(false);
  const [mayarSuccessAnim, setMayarSuccessAnim] = useState<boolean>(false);

  // Discount modal state
  const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false);
  const [inputDiscount, setInputDiscount] = useState<number>(0);
  const [inputReason, setInputReason] = useState<string>('');

  // Fetch products and branch stock
  const fetchProductsAndStock = async () => {
    setLoading(true);
    try {
      const { data: prodData, error: prodErr } = await supabase
        .from('produk')
        .select('*')
        .eq('aktif', true)
        .order('kategori')
        .order('nama');

      const targetCabangId = cabang?.id || '030cfd87-60a3-51b0-9cdf-c083b46a32cd';

      // If Supabase returned empty products or errored, use SEED_PRODUCTS fallback
      if (prodErr || !prodData || prodData.length === 0) {
        console.warn('Supabase produk kosong/gagal, menggunakan data cadangan (SEED_PRODUCTS)');
        // Try fetching stock from DB if available
        let stockMap = new Map();
        try {
          const { data: stockData } = await supabase
            .from('stok_cabang')
            .select('produk_id, jumlah, stok_minimum')
            .eq('cabang_id', targetCabangId);
          stockData?.forEach((s) => {
            stockMap.set(s.produk_id, { jumlah: s.jumlah, stok_minimum: s.stok_minimum });
          });
        } catch {
          // ignore
        }

        const merged = SEED_PRODUCTS.map((p) => {
          const s = stockMap.get(p.id);
          return {
            ...p,
            stok_saat_ini: s ? s.jumlah : (p.stok_saat_ini ?? (p.lacak_stok ? 20 : 999)),
            stok_minimum: s ? s.stok_minimum : (p.stok_minimum ?? 5),
          };
        });
        setProducts(merged as any);
        return;
      }

      // If Supabase has live products, merge with branch stock
      const { data: stockData } = await supabase
        .from('stok_cabang')
        .select('produk_id, jumlah, stok_minimum')
        .eq('cabang_id', targetCabangId);

      const stockMap = new Map();
      stockData?.forEach((s) => {
        stockMap.set(s.produk_id, { jumlah: s.jumlah, stok_minimum: s.stok_minimum });
      });

      const merged = prodData.map((p) => {
        const s = stockMap.get(p.id);
        return {
          ...p,
          stok_saat_ini: s ? s.jumlah : (p.stok_saat_ini ?? (p.lacak_stok ? 20 : 999)),
          stok_minimum: s ? s.stok_minimum : (p.stok_minimum ?? 5),
        };
      });
      setProducts(merged);
    } catch (err) {
      console.error('fetchProductsAndStock error, fallback ke SEED_PRODUCTS:', err);
      setProducts(SEED_PRODUCTS as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndStock();
  }, [cabang?.id]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'semua' ? true : p.kategori === selectedCategory;
      const matchesSearch =
        p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const categories = [
    { key: 'semua', label: 'Semua Menu', icon: '✨' },
    { key: 'kopi', label: 'Kopi', icon: '☕' },
    { key: 'non_kopi', label: 'Non Kopi', icon: '🍵' },
    { key: 'roti', label: 'Roti & Pastry', icon: '🥐' },
    { key: 'snack', label: 'Snack', icon: '🍪' },
    { key: 'kemasan', label: 'Kemasan', icon: '📦' },
  ];

  const handleApplyDiscount = () => {
    if (inputDiscount > subtotal) {
      alert('Diskon tidak boleh lebih besar dari subtotal!');
      return;
    }
    if (inputDiscount > 0 && (!inputReason || inputReason.trim() === '')) {
      alert('BR-06: Wajib menyertakan alasan pemberian diskon!');
      return;
    }
    setDiskonInfo(inputDiscount, inputReason);
    setShowDiscountModal(false);
  };

  const handleCheckoutSubmit = async () => {
    setCheckoutError('');
    setCheckoutLoading(true);
    const res = await processCheckout();
    setCheckoutLoading(false);
    if (!res.success) {
      setCheckoutError(res.error || 'Checkout gagal');
    } else {
      // Refresh stock after purchase
      fetchProductsAndStock();
    }
  };

  const closeMayarModal = () => {
    setShowMayarModal(false);
    broadcastCustomerDisplay({
      cabangNama: cabang?.nama || 'Lumbung Kopi dan Roti',
      tipePesanan,
      namaPelanggan,
      items: cart.map((c) => ({
        id: c.produk.id,
        nama: c.produk.nama,
        jumlah: c.jumlah,
        harga_satuan: c.produk.harga_jual,
        subtotal: c.subtotal,
      })),
      subtotal,
      diskon,
      total,
      metodeBayar: 'qris',
      uangDiterima: total,
      kembalian: 0,
      status: 'active',
      mayarModalOpen: false,
    });
  };

  const handleCheckoutClick = async () => {
    if (metodeBayar === 'qris') {
      setMayarLoading(true);
      setMayarSuccessAnim(false);
      setShowMayarModal(true);

      // Broadcast modal opening immediately to customer display
      broadcastCustomerDisplay({
        cabangNama: cabang?.nama || 'Lumbung Kopi dan Roti',
        tipePesanan,
        namaPelanggan,
        items: cart.map((c) => ({
          id: c.produk.id,
          nama: c.produk.nama,
          jumlah: c.jumlah,
          harga_satuan: c.produk.harga_jual,
          subtotal: c.subtotal,
        })),
        subtotal,
        diskon,
        total,
        metodeBayar: 'qris',
        uangDiterima: total,
        kembalian: 0,
        status: 'active',
        mayarModalOpen: true,
        mayarAmount: total,
      });

      try {
        const res = await createMayarQRIS({
          amount: total,
          orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
          customerName: namaPelanggan || 'Pelanggan Walk-in',
          branchName: cabang?.nama || 'Lumbung Kopi dan Roti',
          items: cart.map((c) => ({
            nama: c.produk.nama,
            qty: c.jumlah,
            harga: c.produk.harga_jual,
          })),
        });
        setMayarPaymentData(res);

        // Broadcast generated QRIS code and transaction ID to customer display
        broadcastCustomerDisplay({
          cabangNama: cabang?.nama || 'Lumbung Kopi dan Roti',
          tipePesanan,
          namaPelanggan,
          items: cart.map((c) => ({
            id: c.produk.id,
            nama: c.produk.nama,
            jumlah: c.jumlah,
            harga_satuan: c.produk.harga_jual,
            subtotal: c.subtotal,
          })),
          subtotal,
          diskon,
          total,
          metodeBayar: 'qris',
          uangDiterima: total,
          kembalian: 0,
          status: 'active',
          mayarModalOpen: true,
          mayarQrCodeUrl: res.qrCodeUrl,
          mayarPaymentId: res.paymentId,
          mayarPaymentUrl: res.paymentUrl,
          mayarAmount: total,
        });
      } catch (err) {
        console.error('Mayar QRIS error:', err);
      } finally {
        setMayarLoading(false);
      }
    } else {
      await handleCheckoutSubmit();
    }
  };

  const handleSimulateMayarSuccess = async () => {
    setMayarSuccessAnim(true);
    // Broadcast immediately to customer display that payment succeeded
    broadcastCustomerDisplay({
      cabangNama: cabang?.nama || 'Lumbung Kopi dan Roti',
      tipePesanan,
      namaPelanggan,
      items: cart.map((c) => ({
        id: c.produk.id,
        nama: c.produk.nama,
        jumlah: c.jumlah,
        harga_satuan: c.produk.harga_jual,
        subtotal: c.subtotal,
      })),
      subtotal,
      diskon,
      total,
      metodeBayar: 'qris',
      uangDiterima: total,
      kembalian: 0,
      status: 'completed',
      lastCompletedStruk: `QRIS-${Date.now().toString().slice(-6)}`,
      mayarModalOpen: false,
    });

    setTimeout(async () => {
      closeMayarModal();
      setMayarSuccessAnim(false);
      await handleCheckoutSubmit();
    }, 1200);
  };
  const getCategoryStyle = (kategori?: string) => {
    switch (kategori) {
      case 'kopi':
        return {
          accentColor: '#b45309',
          lightBg: '#fef3c7',
          textColor: '#92400e',
          borderColor: '#fde68a',
          tag: 'Kopi',
          icon: '☕',
        };
      case 'non_kopi':
        return {
          accentColor: '#059669',
          lightBg: '#ecfdf5',
          textColor: '#065f46',
          borderColor: '#a7f3d0',
          tag: 'Non Kopi',
          icon: '🍵',
        };
      case 'roti':
        return {
          accentColor: '#ea580c',
          lightBg: '#fff7ed',
          textColor: '#9a3412',
          borderColor: '#fed7aa',
          tag: 'Roti & Bakery',
          icon: '🥐',
        };
      case 'snack':
        return {
          accentColor: '#ca8a04',
          lightBg: '#fefce8',
          textColor: '#854d0e',
          borderColor: '#fef08a',
          tag: 'Camilan',
          icon: '🍪',
        };
      case 'kemasan':
      default:
        return {
          accentColor: '#475569',
          lightBg: '#f1f5f9',
          textColor: '#334155',
          borderColor: '#cbd5e1',
          tag: 'Kemasan',
          icon: '📦',
        };
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 380px',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
    }}>
      {/* Left Column: Product Catalog & Search */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderRight: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
      }}>
        {/* Top Controls: Search & Category tabs */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}>
          {/* Ambient Live Branch Banner */}
          <div style={{
            padding: '10px 16px',
            background: 'linear-gradient(90deg, #2c1003 0%, #451a03 50%, #78350f 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '14px',
            boxShadow: '0 4px 14px rgba(44, 16, 3, 0.25)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'rgba(251, 191, 36, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef3c7',
              }}>
                <Coffee size={17} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.2px' }}>
                  Katalog Menu • {cabang?.nama || 'Lumbung Tebet'}
                </div>
                <div style={{ fontSize: '10.5px', color: '#fde68a' }}>
                  Pilih menu kopi racikan &amp; roti segar untuk pelanggan
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                fontSize: '10px',
                fontWeight: 800,
                color: '#a7f3d0',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399', boxShadow: '0 0 6px #34d399' }} />
                TERMINAL POS AKTIF
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px' }} />
              <input
                type="text"
                placeholder="Cari nama menu kopi, pastry, roti, atau SKU (contoh: KOP-001, Croissant)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#d97706';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={fetchProductsAndStock}
              title="Perbarui Stok Real-Time"
              className="hover-lift"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#78350f',
                fontWeight: 700,
                fontSize: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} />
              <span>Sinkron</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className="hover-lift"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '24px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? '#78350f' : '#ffffff',
                    background: isSelected ? 'linear-gradient(135deg, #78350f 0%, #b45309 100%)' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: '1.5px solid',
                    borderColor: isSelected ? '#78350f' : '#e2e8f0',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 4px 14px rgba(120, 53, 15, 0.28)' : '0 1px 3px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span style={{ fontSize: '13px' }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid - Clean POS Architecture */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <RefreshCw size={30} className="animate-spin" style={{ margin: '0 auto 12px auto', color: '#b45309' }} />
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>Menyajikan Katalog Menu...</div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Menghubungkan stok resep cabang</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1.5px dashed #cbd5e1',
              margin: '20px',
            }}>
              <Search size={32} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginTop: '10px' }}>
                Menu Tidak Ditemukan
              </h4>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Tidak ada menu yang sesuai dengan kata kunci "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('semua'); }}
                className="hover-lift"
                style={{
                  marginTop: '14px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: '1px solid #fde68a',
                  cursor: 'pointer',
                }}
              >
                Tampilkan Semua Menu
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: '14px',
            }}>
              {filteredProducts.map((p) => {
                const isOutOfStock = p.lacak_stok && (p.stok_saat_ini ?? 0) <= 0;
                const isLowStock = p.lacak_stok && (p.stok_saat_ini ?? 0) <= (p.stok_minimum ?? 0) && (p.stok_saat_ini ?? 0) > 0;
                const catStyle = getCategoryStyle(p.kategori);

                return (
                  <button
                    key={p.id}
                    disabled={isOutOfStock || !activeShift}
                    onClick={() => addToCart(p)}
                    className={!isOutOfStock && activeShift ? "hover-lift hover-glow" : ""}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: '16px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid',
                      borderColor: isLowStock ? '#fed7aa' : '#e2e8f0',
                      textAlign: 'left',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      opacity: isOutOfStock || !activeShift ? 0.55 : 1,
                      cursor: isOutOfStock || !activeShift ? 'not-allowed' : 'pointer',
                      padding: '16px',
                      minHeight: '138px',
                    }}
                  >
                    {/* Top Row: Category Tag Pill + Stock Pill */}
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        marginBottom: '10px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            color: catStyle.textColor,
                            backgroundColor: catStyle.lightBg,
                            border: `1px solid ${catStyle.borderColor}`,
                            padding: '2.5px 7px',
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <span style={{ fontSize: '11px' }}>{catStyle.icon}</span>
                            <span>{catStyle.tag}</span>
                          </span>
                          <span style={{
                            fontSize: '9.5px',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#94a3b8',
                          }}>
                            {p.sku}
                          </span>
                        </div>

                        {/* Stock indicator pill with cute emoji */}
                        {!p.lacak_stok ? (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            color: '#059669',
                            backgroundColor: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            padding: '2.5px 8px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}>
                            ✨ Racikan
                          </span>
                        ) : isOutOfStock ? (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            color: '#dc2626',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            padding: '2.5px 8px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}>
                            ❌ Habis
                          </span>
                        ) : isLowStock ? (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            color: '#c2410c',
                            backgroundColor: '#fff7ed',
                            border: '1px solid #fed7aa',
                            padding: '2.5px 8px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}>
                            ⚠️ Sisa {p.stok_saat_ini}!
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 600,
                            color: '#64748b',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '2.5px 8px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}>
                            📦 Stok {p.stok_saat_ini}
                          </span>
                        )}
                      </div>

                      {/* Product Name */}
                      <h4 style={{
                        fontSize: '14.5px',
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.35,
                        margin: 0,
                      }}>
                        {p.nama}
                      </h4>
                    </div>

                    {/* Bottom Row: Price & Quick Add Button */}
                    <div style={{
                      marginTop: '14px',
                      paddingTop: '10px',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          Harga Jual
                        </span>
                        <span style={{ fontSize: '15.5px', fontWeight: 900, color: '#78350f', letterSpacing: '-0.3px' }}>
                          Rp{p.harga_jual.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '9px',
                        background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
                        color: '#fef3c7',
                        border: '1px solid #d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)',
                        transition: 'all 0.15s ease',
                      }}>
                        <Plus size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Cart, Discount & Checkout */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e2e8f0',
      }}>
        {/* Cart Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Pesanan Kasir
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {cart.reduce((a, b) => a + b.jumlah, 0)} item dipilih
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => window.open('/?mode=customer-display', 'LumbungCustomerDisplay', 'width=1000,height=750')}
              title="Buka Layar Pelanggan di tab/monitor terpisah"
              className="hover-lift"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#78350f',
                backgroundColor: '#fef3c7',
                border: '1.5px solid #fde68a',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(245, 158, 11, 0.1)',
              }}
            >
              <Monitor size={13} />
              <span>Layar Pelanggan</span>
            </button>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                title="Kosongkan Keranjang"
                style={{
                  fontSize: '11px',
                  color: '#dc2626',
                  fontWeight: 700,
                  padding: '5px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  cursor: 'pointer',
                }}
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Tipe Pesanan & Nama Pelanggan Section */}
        <div style={{
          padding: '12px 18px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setTipePesanan('dine_in')}
              className="hover-lift"
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: tipePesanan === 'dine_in' ? '#b45309' : '#e2e8f0',
                backgroundColor: tipePesanan === 'dine_in' ? '#fef3c7' : '#ffffff',
                color: tipePesanan === 'dine_in' ? '#78350f' : '#64748b',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: tipePesanan === 'dine_in' ? '0 2px 6px rgba(180, 83, 9, 0.12)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🍽️</span>
              <span>Dine-In (Di Tempat)</span>
            </button>

            <button
              type="button"
              onClick={() => setTipePesanan('takeaway')}
              className="hover-lift"
              style={{
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: tipePesanan === 'takeaway' ? '#b45309' : '#e2e8f0',
                backgroundColor: tipePesanan === 'takeaway' ? '#fef3c7' : '#ffffff',
                color: tipePesanan === 'takeaway' ? '#78350f' : '#64748b',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: tipePesanan === 'takeaway' ? '0 2px 6px rgba(180, 83, 9, 0.12)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🛍️</span>
              <span>Takeaway (Bungkus)</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '10px',
            padding: '7px 10px',
            transition: 'all 0.2s',
          }}>
            <User size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Nama pemesan / No. meja (cth: Kak Sarah • Meja 03)"
              value={namaPelanggan}
              onChange={(e) => setNamaPelanggan(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '12px',
                width: '100%',
                backgroundColor: 'transparent',
                color: '#1e293b',
                fontWeight: 600,
              }}
            />
          </div>
        </div>

        {/* Shift Warning banner if not open */}
        {!activeShift && (
          <div style={{
            padding: '12px 18px',
            backgroundColor: '#fffbeb',
            borderBottom: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="#d97706" />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>
                  Shift Kasir Belum Dibuka
                </div>
                <div style={{ fontSize: '11px', color: '#b45309' }}>
                  Buka shift untuk mulai menyimpan transaksi
                </div>
              </div>
            </div>
            <button
              onClick={onOpenShiftModal}
              className="hover-lift"
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#ffffff',
                backgroundColor: '#b45309',
                background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
                padding: '6px 12px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(180, 83, 9, 0.25)',
                cursor: 'pointer',
              }}
            >
              Buka Shift
            </button>
          </div>
        )}

        {/* Cart Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '14px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          {cart.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              gap: '10px',
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f8fafc',
                border: '1.5px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
              }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#334155', margin: 0 }}>
                Keranjang Masih Kosong
              </h4>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, maxWidth: '200px' }}>
                Pilih menu kopi atau roti dari katalog untuk memulai pesanan
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const itemCatStyle = getCategoryStyle(item.produk.kategori);
              return (
              <div
                key={item.produk.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px 14px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: itemCatStyle.lightBg,
                    color: itemCatStyle.textColor,
                    border: `1px solid ${itemCatStyle.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    flexShrink: 0,
                  }}>
                    {itemCatStyle.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.produk.nama}
                    </h5>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      @Rp{item.produk.harga_jual.toLocaleString('id-ID')} • {item.jumlah}x
                    </span>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: 900, color: '#78350f', flexShrink: 0 }}>
                    Rp{item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  {/* Quantity Controls (BR-05: 1 s.d. 99) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#f8fafc',
                    padding: '3px 6px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}>
                    <button
                      onClick={() => updateQuantity(item.produk.id, item.jumlah - 1)}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '6px',
                        color: '#475569',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Minus size={13} strokeWidth={2.5} />
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 800, minWidth: '26px', textAlign: 'center', color: '#0f172a' }}>
                      {item.jumlah}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.produk.id, item.jumlah + 1)}
                      disabled={item.jumlah >= 99}
                      style={{
                        padding: '4px 6px',
                        borderRadius: '6px',
                        color: '#475569',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.produk.id)}
                    style={{
                      color: '#ef4444',
                      padding: '5px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    title="Hapus Item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
            })
          )}
        </div>

        {/* Cart Bottom Summary & Checkout Panel */}
        <div style={{
          padding: '16px 18px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
        }}>
          {/* Subtotal & Discount rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span style={{ fontWeight: 600 }}>Subtotal:</span>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>Rp{subtotal.toLocaleString('id-ID')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Diskon:</span>
                <button
                  onClick={() => {
                    setInputDiscount(diskon);
                    setInputReason(alasanDiskon);
                    setShowDiscountModal(true);
                  }}
                  className="hover-lift"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#92400e',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Tag size={12} />
                  <span>{diskon > 0 ? `Ubah (Rp${diskon.toLocaleString('id-ID')})` : '+ Beri Diskon'}</span>
                </button>
              </div>
              <span style={{ fontWeight: 800, color: diskon > 0 ? '#dc2626' : '#64748b' }}>
                {diskon > 0 ? `-Rp${diskon.toLocaleString('id-ID')}` : 'Rp0'}
              </span>
            </div>

            {/* Total Tagihan Card */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '4px',
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: '#fffbeb',
              border: '1.5px solid #fde68a',
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  TOTAL TAGIHAN
                </span>
                <div style={{ fontSize: '10px', color: '#b45309' }}>Termasuk PPN &amp; Layanan</div>
              </div>
              <span style={{ fontSize: '19px', fontWeight: 900, color: '#78350f' }}>
                Rp{total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Metode Pembayaran
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setMetodeBayar('tunai')}
                className="hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: metodeBayar === 'tunai' ? '#b45309' : '#cbd5e1',
                  backgroundColor: metodeBayar === 'tunai' ? '#fef3c7' : '#ffffff',
                  color: metodeBayar === 'tunai' ? '#78350f' : '#475569',
                  fontSize: '12px',
                  fontWeight: 800,
                  boxShadow: metodeBayar === 'tunai' ? '0 2px 8px rgba(180, 83, 9, 0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Banknote size={16} />
                <span>Tunai (Cash)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMetodeBayar('qris');
                  setUangDiterima(total);
                }}
                className="hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: metodeBayar === 'qris' ? '#0284c7' : '#cbd5e1',
                  backgroundColor: metodeBayar === 'qris' ? '#e0f2fe' : '#ffffff',
                  color: metodeBayar === 'qris' ? '#0369a1' : '#475569',
                  fontSize: '12px',
                  fontWeight: 800,
                  boxShadow: metodeBayar === 'qris' ? '0 2px 8px rgba(2, 132, 199, 0.15)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <QrCode size={16} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                  <span>QRIS</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: metodeBayar === 'qris' ? '#0284c7' : '#94a3b8' }}>Mayar Gateway</span>
                </div>
              </button>
            </div>
          </div>

          {/* Cash input & Change (if Tunai) */}
          {metodeBayar === 'tunai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  min="0"
                  placeholder="Uang Diterima (Rp)"
                  value={uangDiterima || ''}
                  onChange={(e) => setUangDiterima(Number(e.target.value))}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d97706';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setUangDiterima(total)}
                  className="hover-lift"
                  style={{
                    padding: '9px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#f1f5f9',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#334155',
                    border: '1.5px solid #cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  Uang Pas
                </button>
              </div>

              {/* Quick Cash Presets */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {[50000, 100000, 150000, 200000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setUangDiterima(preset)}
                    className="hover-lift"
                    style={{
                      flex: 1,
                      padding: '5px 2px',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {preset / 1000}k
                  </button>
                ))}
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                padding: '6px 10px',
                backgroundColor: uangDiterima >= total ? '#ecfdf5' : '#fff1f2',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: uangDiterima >= total ? '#a7f3d0' : '#fecdd3',
              }}>
                <span style={{ color: uangDiterima >= total ? '#065f46' : '#9f1239', fontWeight: 600 }}>Kembalian:</span>
                <span style={{
                  fontWeight: 900,
                  color: uangDiterima >= total ? '#059669' : '#dc2626',
                }}>
                  {uangDiterima >= total
                    ? `Rp${kembalian.toLocaleString('id-ID')}`
                    : `Kurang Rp${(total - uangDiterima).toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
          )}

          {checkoutError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '12px',
              fontWeight: 600,
            }}>
              ⚠️ {checkoutError}
            </div>
          )}

          {/* Checkout Submit CTA */}
          <button
            type="button"
            disabled={cart.length === 0 || !activeShift || checkoutLoading || (metodeBayar === 'tunai' && uangDiterima < total)}
            onClick={handleCheckoutClick}
            className="hover-lift hover-glow"
            style={{
              padding: '13px',
              borderRadius: '12px',
              background: metodeBayar === 'qris'
                ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                : 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              boxShadow: metodeBayar === 'qris'
                ? '0 6px 18px rgba(2, 132, 199, 0.35)'
                : '0 6px 18px rgba(180, 83, 9, 0.35)',
              opacity: cart.length === 0 || !activeShift || checkoutLoading || (metodeBayar === 'tunai' && uangDiterima < total) ? 0.5 : 1,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: cart.length === 0 || !activeShift || checkoutLoading || (metodeBayar === 'tunai' && uangDiterima < total) ? 'not-allowed' : 'pointer',
            }}
          >
            {metodeBayar === 'qris' ? <QrCode size={18} /> : <Banknote size={18} />}
            <span>
              {checkoutLoading
                ? 'Memproses Transaksi...'
                : metodeBayar === 'qris'
                ? `Buka QRIS Mayar • Rp${total.toLocaleString('id-ID')}`
                : `Bayar Tunai Rp${total.toLocaleString('id-ID')}`}
            </span>
          </button>
        </div>
      </div>

      {/* Modal Diskon */}
      {showDiscountModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '380px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
              Atur Diskon Transaksi
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Nominal Diskon (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={inputDiscount}
                  onChange={(e) => setInputDiscount(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Alasan Diskon (Wajib bila diskon &gt; 0)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Promo Grand Opening, Pelanggan Setia"
                  value={inputReason}
                  onChange={(e) => setInputReason(e.target.value)}
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
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setShowDiscountModal(false)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  color: '#475569',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyDiscount}
                style={{
                  flex: 1.5,
                  padding: '8px',
                  borderRadius: '6px',
                  backgroundColor: '#78350f',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                Terapkan Diskon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mayar.id Dynamic QRIS Payment Modal */}
      {showMayarModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '430px',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            {/* Close Button */}
            <button
              onClick={closeMayarModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            {/* Header Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
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

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 4px 0' }}>
              QRIS Dinamis Otomatis
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Scan dengan BCA Mobile, Mandiri Livin, GoPay, OVO, ShopeePay, atau aplikasi QRIS apa saja
            </p>

            {/* Total Amount Box */}
            <div style={{
              width: '100%',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>Total Tagihan</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7' }}>
                  Rp{total.toLocaleString('id-ID')}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>ID Transaksi</span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#334155' }}>
                  {mayarPaymentData?.paymentId || 'Generating...'}
                </span>
              </div>
            </div>

            {/* Dynamic QR Display */}
            <div style={{
              padding: '12px',
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '2px dashed #0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)',
              minHeight: '230px',
              width: '230px',
            }}>
              {mayarLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <RefreshCw size={28} className="animate-spin" color="#0284c7" />
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Menghubungi Mayar API...</span>
                </div>
              ) : mayarSuccessAnim ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', textAlign: 'center', padding: '10px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                  }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <span style={{ fontSize: '18px', color: '#16a34a', fontWeight: 900 }}>
                    Pembayaran Berhasil!
                  </span>
                  <span style={{ fontSize: '12px', color: '#047857', fontWeight: 700 }}>
                    Dana QRIS Rp{total.toLocaleString('id-ID')} Telah Diterima
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Mencetak struk transaksi...
                  </span>
                </div>
              ) : (
                <img
                  src={mayarPaymentData?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226680016ID.MAYAR.WWW01189360091100200000020215MYR-DEMO520458125303360540${total}5802ID5918LUMBUNG+KOPI+ROTI6007JAKARTA6304ABCD`}
                  alt="QRIS Mayar.id"
                  style={{ width: '210px', height: '210px', display: 'block', borderRadius: '8px' }}
                />
              )}
            </div>

            {/* Timer and Realtime Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '11px',
              color: '#64748b',
              fontWeight: 600,
            }}>
              <Clock size={13} color="#0284c7" />
              <span>Berlaku 15:00 menit • Webhook Auto-Detect</span>
            </div>

            {/* Quick Simulation / Webhook Receiver CTA */}
            <div style={{ width: '100%', marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                disabled={mayarLoading || mayarSuccessAnim}
                onClick={handleSimulateMayarSuccess}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                }}
              >
                <Zap size={16} />
                <span>Simulasikan Webhook Mayar Berhasil (Sandbox)</span>
              </button>

              <button
                type="button"
                onClick={closeMayarModal}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Tutup / Batalkan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
