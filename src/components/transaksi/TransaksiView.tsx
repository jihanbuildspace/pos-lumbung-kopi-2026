import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Transaksi, Cabang } from '../../types/database';
import { Search, Filter, Ban, Eye, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';

interface TransaksiViewProps {
  onViewReceipt: (transaksi: any) => void;
}

export const TransaksiView: React.FC<TransaksiViewProps> = ({ onViewReceipt }) => {
  const { profile, cabang, allCabang } = useAuth();
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchStruk, setSearchStruk] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [metodeFilter, setMetodeFilter] = useState<string>('semua');
  const [selectedCabangId, setSelectedCabangId] = useState<string>(profile?.cabang_id || 'semua');

  // Void modal state
  const [showVoidModal, setShowVoidModal] = useState<boolean>(false);
  const [targetVoid, setTargetVoid] = useState<Transaksi | null>(null);
  const [alasanVoid, setAlasanVoid] = useState<string>('');
  const [voidLoading, setVoidLoading] = useState<boolean>(false);
  const [voidError, setVoidError] = useState<string>('');

  useEffect(() => {
    if (profile?.peran !== 'owner' && profile?.cabang_id) {
      setSelectedCabangId(profile.cabang_id);
    } else if (profile?.peran === 'owner') {
      setSelectedCabangId('semua');
    }
  }, [profile?.id, profile?.peran]);

  const fetchTransaksi = async () => {
    if (transaksiList.length === 0) {
      setLoading(true);
    }
    try {
      let query = supabase
        .from('transaksi')
        .select(`
          *,
          cabang:cabang(*),
          kasir:profiles!transaksi_kasir_id_fkey(*),
          items:transaksi_item(*)
        `)
        .order('dibuat_pada', { ascending: false });

      // If user is tied to branch, restrict to branch
      if (profile?.peran === 'kasir') {
        query = query.eq('kasir_id', profile.id);
      } else if (profile?.peran === 'kepala_toko') {
        query = query.eq('cabang_id', profile.cabang_id);
      } else if (profile?.peran === 'owner' && selectedCabangId !== 'semua') {
        query = query.eq('cabang_id', selectedCabangId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching transactions:', error);
      } else if (data) {
        setTransaksiList(data as any);
      }
    } catch (err) {
      console.error('fetchTransaksi error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, [profile?.id, profile?.peran, selectedCabangId]);

  // Filtered transactions
  const filteredList = transaksiList.filter((t) => {
    const matchesSearch = t.nomor_struk.toLowerCase().includes(searchStruk.toLowerCase());
    const matchesStatus = statusFilter === 'semua' ? true : t.status === statusFilter;
    const matchesMetode = metodeFilter === 'semua' ? true : t.metode_bayar === metodeFilter;
    return matchesSearch && matchesStatus && matchesMetode;
  });

  // Handle Void submit (BR-08)
  const handleConfirmVoid = async () => {
    if (!targetVoid || !profile) return;
    if (!alasanVoid || alasanVoid.trim() === '') {
      setVoidError('BR-08: Alasan pembatalan (void) wajib diisi');
      return;
    }

    setVoidLoading(true);
    setVoidError('');

    try {
      const { data, error } = await supabase.rpc('rpc_void_transaksi', {
        p_transaksi_id: targetVoid.id,
        p_user_id: profile.id,
        p_alasan: alasanVoid.trim(),
      });

      if (error) {
        setVoidError(error.message);
      } else {
        alert(`Transaksi ${targetVoid.nomor_struk} berhasil di-void! Stok produk telah dikembalikan.`);
        setShowVoidModal(false);
        setTargetVoid(null);
        setAlasanVoid('');
        await fetchTransaksi();
      }
    } catch (err: any) {
      setVoidError(err.message || 'Terjadi kesalahan saat memproses void');
    } finally {
      setVoidLoading(false);
    }
  };

  const isAuthorizedToVoid = profile?.peran === 'kepala_toko' || profile?.peran === 'owner';

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
            Riwayat Transaksi
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {profile?.peran === 'owner'
              ? 'Data penjualan seluruh cabang Lumbung Kopi dan Roti'
              : `${cabang?.nama} • Hanya menampilkan transaksi cabang Anda`}
          </p>
        </div>

        {/* Branch Filter for Owner */}
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
            <option value="semua">Semua Cabang (Konsolidasi)</option>
            {allCabang.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama} ({c.kode})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '14px 18px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          <input
            type="text"
            placeholder="Cari nomor struk (contoh: TBT-20261015-0003)..."
            value={searchStruk}
            onChange={(e) => setSearchStruk(e.target.value)}
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            outline: 'none',
            backgroundColor: '#ffffff',
          }}
        >
          <option value="semua">Semua Status</option>
          <option value="lunas">Lunas</option>
          <option value="void">Void</option>
          <option value="menunggu_bayar">Menunggu Bayar</option>
          <option value="batal">Batal</option>
        </select>

        <select
          value={metodeFilter}
          onChange={(e) => setMetodeFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '12px',
            outline: 'none',
            backgroundColor: '#ffffff',
          }}
        >
          <option value="semua">Semua Metode</option>
          <option value="tunai">Tunai</option>
          <option value="qris">QRIS</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Memuat transaksi...
          </div>
        ) : filteredList.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Tidak ada transaksi ditemukan
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Nomor Struk</th>
                <th style={{ padding: '12px 16px' }}>Waktu</th>
                {profile?.peran === 'owner' && <th style={{ padding: '12px 16px' }}>Cabang</th>}
                <th style={{ padding: '12px 16px' }}>Kasir</th>
                <th style={{ padding: '12px 16px' }}>Metode</th>
                <th style={{ padding: '12px 16px' }}>Total</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((trx) => {
                const isVoid = trx.status === 'void';
                const formattedDate = new Date(trx.dibuat_pada).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr
                    key={trx.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isVoid ? '#fff1f2' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'monospace', color: '#1e293b' }}>
                      {trx.nomor_struk}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {formattedDate}
                    </td>
                    {profile?.peran === 'owner' && (
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                        {trx.cabang?.nama}
                      </td>
                    )}
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      {trx.kasir?.nama_lengkap || '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: trx.metode_bayar === 'tunai' ? '#ecfdf5' : '#e0e7ff',
                        color: trx.metode_bayar === 'tunai' ? '#065f46' : '#3730a3',
                        textTransform: 'uppercase',
                      }}>
                        {trx.metode_bayar}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#1e293b' }}>
                      Rp{trx.total.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isVoid ? '#fee2e2' : '#dcfce7',
                        color: isVoid ? '#b91c1c' : '#15803d',
                        textTransform: 'uppercase',
                      }}>
                        {trx.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {/* Detail / Print Struk button */}
                        <button
                          onClick={() => onViewReceipt(trx)}
                          title="Lihat & Cetak Struk"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          <FileText size={14} />
                          <span>Struk</span>
                        </button>

                        {/* Void Button (BR-08: Only Kepala Toko & Owner) */}
                        {!isVoid && isAuthorizedToVoid && (
                          <button
                            onClick={() => {
                              setTargetVoid(trx);
                              setAlasanVoid('');
                              setVoidError('');
                              setShowVoidModal(true);
                            }}
                            title="Batalkan Transaksi (Void)"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            <Ban size={14} />
                            <span>Void</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Konfirmasi Void (BR-08) */}
      {showVoidModal && targetVoid && (
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
              backgroundColor: '#fee2e2',
              borderBottom: '1px solid #fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#991b1b',
            }}>
              <AlertOctagon size={20} />
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>
                Otorisasi Pembatalan (Void)
              </h3>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
                <p><strong>Nomor Struk:</strong> {targetVoid.nomor_struk}</p>
                <p><strong>Total Transaksi:</strong> Rp{targetVoid.total.toLocaleString('id-ID')}</p>
                <p><strong>Kasir:</strong> {targetVoid.kasir?.nama_lengkap}</p>
                <p style={{ color: '#059669', marginTop: '4px' }}>
                  ✓ Stok produk yang terlacak akan dikembalikan ke stok cabang secara atomik.
                </p>
              </div>

              {voidError && (
                <div style={{ padding: '10px', backgroundColor: '#fee2e2', borderRadius: '6px', color: '#991b1b', fontSize: '11px', fontWeight: 600 }}>
                  {voidError}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Alasan Void * (BR-08: Wajib Diisi)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Pelanggan membatalkan pesanan, salah input item kasir..."
                  value={alasanVoid}
                  onChange={(e) => setAlasanVoid(e.target.value)}
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
                  disabled={voidLoading}
                  onClick={() => setShowVoidModal(false)}
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
                  disabled={voidLoading}
                  onClick={handleConfirmVoid}
                  style={{
                    flex: 1.5,
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {voidLoading ? 'Memproses...' : 'Konfirmasi Void'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
