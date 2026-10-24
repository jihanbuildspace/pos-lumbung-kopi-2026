import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Produk } from '../../types/database';
import { SEED_PRODUCTS } from '../../lib/seedData';
import { Search, Coffee, Tag, ShieldCheck, RefreshCw } from 'lucide-react';

export const ProdukView: React.FC = () => {
  const { profile } = useAuth();
  const isOwner = profile?.peran === 'owner';
  const [products, setProducts] = useState<any[]>(SEED_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');

  useEffect(() => {
    fetchProducts();
  }, [profile]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: prodData, error } = await supabase
        .from('produk')
        .select('*')
        .order('kategori')
        .order('nama');

      if (error || !prodData || prodData.length === 0) {
        console.warn('Menggunakan data produk bawaan (SEED_PRODUCTS):', error);
        setProducts(SEED_PRODUCTS);
        return;
      }

      if (isOwner) {
        // Fetch riwayat harga modal
        const { data: modalData } = await supabase
          .from('riwayat_harga_modal')
          .select('produk_id, harga_modal, berlaku_mulai')
          .order('berlaku_mulai', { ascending: false });

        const modalMap = new Map();
        modalData?.forEach((m) => {
          if (!modalMap.has(m.produk_id)) {
            modalMap.set(m.produk_id, m.harga_modal);
          }
        });

        const merged = prodData.map((p) => ({
          ...p,
          harga_modal: modalMap.get(p.id) || 0,
        }));
        setProducts(merged);
      } else {
        setProducts(prodData);
      }
    } catch (err) {
      console.error('fetchProducts error, fallback ke SEED_PRODUCTS:', err);
      setProducts(SEED_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'semua' ? true : p.kategori === selectedCategory;
    const matchesSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
          Katalog Produk
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          Daftar seluruh menu kopi, non-kopi, bakery, snack, dan kemasan Lumbung Kopi dan Roti
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Cari SKU atau nama menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="semua">Semua Kategori</option>
            <option value="kopi">Kopi</option>
            <option value="non_kopi">Non Kopi</option>
            <option value="roti">Roti</option>
            <option value="snack">Snack</option>
            <option value="kemasan">Kemasan</option>
          </select>

          <button
            onClick={fetchProducts}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Memuat produk...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>SKU</th>
                <th style={{ padding: '12px 16px' }}>Nama Menu</th>
                <th style={{ padding: '12px 16px' }}>Kategori</th>
                <th style={{ padding: '12px 16px' }}>Harga Jual</th>
                {isOwner && <th style={{ padding: '12px 16px', color: '#92400e' }}>Harga Modal (Owner)</th>}
                {isOwner && <th style={{ padding: '12px 16px', color: '#92400e' }}>Margin Satuan</th>}
                <th style={{ padding: '12px 16px' }}>Lacak Stok</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={isOwner ? 8 : 6}
                    style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}
                  >
                    <p style={{ fontWeight: 600, color: '#1e293b' }}>Tidak ada menu yang sesuai</p>
                    <p style={{ fontSize: '12px', marginTop: '4px' }}>Coba ubah kata kunci pencarian atau ganti filter kategori.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                const margin = isOwner && p.harga_modal ? p.harga_jual - p.harga_modal : 0;
                const marginPct = isOwner && p.harga_jual > 0 && p.harga_modal ? Math.round((margin / p.harga_jual) * 100) : 0;

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#b45309' }}>
                      {p.sku}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                      {p.nama}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        textTransform: 'capitalize',
                      }}>
                        {p.kategori?.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#1e293b' }}>
                      Rp{p.harga_jual?.toLocaleString('id-ID')}
                    </td>
                    {isOwner && (
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#78350f' }}>
                        {p.harga_modal ? `Rp${p.harga_modal.toLocaleString('id-ID')}` : '-'}
                      </td>
                    )}
                    {isOwner && (
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#059669' }}>
                        {p.harga_modal ? `Rp${margin.toLocaleString('id-ID')} (${marginPct}%)` : '-'}
                      </td>
                    )}
                    <td style={{ padding: '12px 16px' }}>
                      {p.lacak_stok ? (
                        <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>Fisik Cabang</span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Racikan</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: p.aktif ? '#ecfdf5' : '#fee2e2',
                        color: p.aktif ? '#065f46' : '#b91c1c',
                      }}>
                        {p.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
