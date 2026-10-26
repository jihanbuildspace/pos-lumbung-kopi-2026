import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { usePOS } from '../../context/POSContext';
import type { Produk, KategoriProduk } from '../../types/database';
import { SEED_PRODUCTS } from '../../lib/seedData';
import { Search, ShoppingBag, Plus, Minus, Trash2, Tag, QrCode, Banknote, AlertCircle, RefreshCw, Monitor, User } from 'lucide-react';

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
    { key: 'semua', label: 'Semua' },
    { key: 'kopi', label: 'Kopi' },
    { key: 'non_kopi', label: 'Non Kopi' },
    { key: 'roti', label: 'Roti' },
    { key: 'snack', label: 'Snack' },
    { key: 'kemasan', label: 'Kemasan' },
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
        }}>
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
                placeholder="Cari nama produk atau SKU (contoh: KOP-001, Croissant)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#b45309';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>
            <button
              onClick={fetchProductsAndStock}
              title="Refresh Stok"
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
              }}
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? '#78350f' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: '1px solid',
                    borderColor: isSelected ? '#78350f' : '#e2e8f0',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Memuat katalog produk...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Tidak ada produk yang cocok dengan pencarian "{searchQuery}"
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '14px',
            }}>
              {filteredProducts.map((p) => {
                const isOutOfStock = p.lacak_stok && (p.stok_saat_ini ?? 0) <= 0;
                const isLowStock = p.lacak_stok && (p.stok_saat_ini ?? 0) <= (p.stok_minimum ?? 0) && (p.stok_saat_ini ?? 0) > 0;

                return (
                  <button
                    key={p.id}
                    disabled={isOutOfStock || !activeShift}
                    onClick={() => addToCart(p)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      textAlign: 'left',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.15s ease',
                      opacity: isOutOfStock || !activeShift ? 0.55 : 1,
                      cursor: isOutOfStock || !activeShift ? 'not-allowed' : 'pointer',
                    }}
                    onMouseOver={(e) => {
                      if (!isOutOfStock && activeShift) {
                        e.currentTarget.style.borderColor = '#b45309';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(180, 83, 9, 0.12)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isOutOfStock && activeShift) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#b45309',
                          backgroundColor: '#fef3c7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}>
                          {p.sku}
                        </span>

                        {/* Stock Badge */}
                        {!p.lacak_stok ? (
                          <span style={{ fontSize: '10px', color: '#059669', fontWeight: 600, backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: '4px' }}>
                            racikan
                          </span>
                        ) : isOutOfStock ? (
                          <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 700, backgroundColor: '#fee2e2', padding: '1px 6px', borderRadius: '4px' }}>
                            Habis
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: isLowStock ? '#fee2e2' : '#f1f5f9',
                            color: isLowStock ? '#b91c1c' : '#475569',
                          }}>
                            Stok: {p.stok_saat_ini}
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', lineHeight: 1.3, minHeight: '34px' }}>
                        {p.nama}
                      </h4>
                    </div>

                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#78350f' }}>
                        Rp{p.harga_jual.toLocaleString('id-ID')}
                      </span>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Plus size={14} />
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
          padding: '12px 16px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={17} color="#78350f" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              Pesanan ({cart.reduce((a, b) => a + b.jumlah, 0)})
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => window.open('/?mode=customer-display', 'LumbungCustomerDisplay', 'width=1000,height=750')}
              title="Buka Layar Pelanggan di tab/monitor terpisah"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#78350f',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <Monitor size={12} />
              <span>Layar Pelanggan</span>
            </button>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600, padding: '4px' }}
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Tipe Pesanan & Nama Pelanggan Section */}
        <div style={{
          padding: '10px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setTipePesanan('dine_in')}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                border: `1.5px solid ${tipePesanan === 'dine_in' ? '#78350f' : '#cbd5e1'}`,
                backgroundColor: tipePesanan === 'dine_in' ? '#fef3c7' : '#ffffff',
                color: tipePesanan === 'dine_in' ? '#78350f' : '#64748b',
                fontWeight: 700,
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🍽️ Dine-In</span>
            </button>

            <button
              type="button"
              onClick={() => setTipePesanan('takeaway')}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                border: `1.5px solid ${tipePesanan === 'takeaway' ? '#78350f' : '#cbd5e1'}`,
                backgroundColor: tipePesanan === 'takeaway' ? '#fef3c7' : '#ffffff',
                color: tipePesanan === 'takeaway' ? '#78350f' : '#64748b',
                fontWeight: 700,
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🛍️ Takeaway</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '5px 8px',
          }}>
            <User size={13} color="#94a3b8" />
            <input
              type="text"
              placeholder="Nama pemesan / No. meja (cth: Kak Sarah • Meja 03)"
              value={namaPelanggan}
              onChange={(e) => setNamaPelanggan(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '11px',
                width: '100%',
                backgroundColor: 'transparent',
                color: '#1e293b',
              }}
            />
          </div>
        </div>

        {/* Shift Warning banner if not open */}
        {!activeShift && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            borderBottom: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#d97706" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#92400e' }}>
                Shift belum dibuka
              </span>
            </div>
            <button
              onClick={onOpenShiftModal}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#b45309',
                padding: '4px 10px',
                borderRadius: '6px',
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
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {cart.length === 0 ? (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              gap: '8px',
            }}>
              <ShoppingBag size={36} strokeWidth={1.5} />
              <p style={{ fontSize: '13px' }}>Pilih produk dari katalog untuk memesan</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.produk.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '10px 12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h5 style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                      {item.produk.nama}
                    </h5>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      @Rp{item.produk.harga_jual.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                    Rp{item.subtotal.toLocaleString('id-ID')}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  {/* Quantity Controls (BR-05: 1 s.d. 99) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    padding: '2px 4px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                  }}>
                    <button
                      onClick={() => updateQuantity(item.produk.id, item.jumlah - 1)}
                      style={{ padding: '3px', color: '#475569' }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '22px', textAlign: 'center' }}>
                      {item.jumlah}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.produk.id, item.jumlah + 1)}
                      disabled={item.jumlah >= 99}
                      style={{ padding: '3px', color: '#475569' }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.produk.id)}
                    style={{ color: '#ef4444', padding: '4px' }}
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Bottom Summary & Checkout Panel */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {/* Subtotal & Discount rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>Rp{subtotal.toLocaleString('id-ID')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#64748b' }}>Diskon:</span>
                <button
                  onClick={() => {
                    setInputDiscount(diskon);
                    setInputReason(alasanDiskon);
                    setShowDiscountModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '11px',
                    color: '#b45309',
                    backgroundColor: '#fef3c7',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}
                >
                  <Tag size={12} />
                  <span>{diskon > 0 ? `Ubah (Rp${diskon.toLocaleString('id-ID')})` : '+ Tambah'}</span>
                </button>
              </div>
              <span style={{ fontWeight: 700, color: diskon > 0 ? '#dc2626' : '#64748b' }}>
                {diskon > 0 ? `-Rp${diskon.toLocaleString('id-ID')}` : 'Rp0'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '8px',
              borderTop: '1px dashed #e2e8f0',
              fontSize: '15px',
              fontWeight: 800,
              color: '#1e293b',
            }}>
              <span>Total Tagihan:</span>
              <span style={{ color: '#78350f' }}>Rp{total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Metode Pembayaran
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setMetodeBayar('tunai')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: metodeBayar === 'tunai' ? '#b45309' : '#cbd5e1',
                  backgroundColor: metodeBayar === 'tunai' ? '#fef3c7' : '#ffffff',
                  color: metodeBayar === 'tunai' ? '#92400e' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <Banknote size={15} />
                <span>Tunai</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMetodeBayar('qris');
                  setUangDiterima(total);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: metodeBayar === 'qris' ? '#b45309' : '#cbd5e1',
                  backgroundColor: metodeBayar === 'qris' ? '#fef3c7' : '#ffffff',
                  color: metodeBayar === 'qris' ? '#92400e' : '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <QrCode size={15} />
                <span>QRIS</span>
              </button>
            </div>
          </div>

          {/* Cash input & Change (if Tunai) */}
          {metodeBayar === 'tunai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  min="0"
                  placeholder="Uang Diterima (Rp)"
                  value={uangDiterima || ''}
                  onChange={(e) => setUangDiterima(Number(e.target.value))}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setUangDiterima(total)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  Uang Pas
                </button>
              </div>

              {/* Quick Cash Presets */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {[50000, 100000, 150000, 200000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setUangDiterima(preset)}
                    style={{
                      flex: 1,
                      padding: '4px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#475569',
                    }}
                  >
                    {preset / 1000}k
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '2px' }}>
                <span style={{ color: '#64748b' }}>Kembalian:</span>
                <span style={{
                  fontWeight: 800,
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
              padding: '8px 12px',
              backgroundColor: '#fef2f2',
              borderRadius: '6px',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: '11px',
              fontWeight: 600,
            }}>
              {checkoutError}
            </div>
          )}

          {/* Checkout Submit CTA */}
          <button
            type="button"
            disabled={cart.length === 0 || !activeShift || checkoutLoading || (metodeBayar === 'tunai' && uangDiterima < total)}
            onClick={handleCheckoutSubmit}
            style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#78350f',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(120, 53, 15, 0.25)',
              opacity: cart.length === 0 || !activeShift || checkoutLoading || (metodeBayar === 'tunai' && uangDiterima < total) ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {checkoutLoading ? 'Memproses Transaksi...' : `Bayar Rp${total.toLocaleString('id-ID')}`}
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
    </div>
  );
};
