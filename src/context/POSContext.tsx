import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Produk, CartItem, ShiftKasir, Transaksi, MetodeBayar, CheckoutPayload } from '../types/database';
import { broadcastCustomerDisplay } from '../lib/customerDisplayService';

interface POSContextType {
  activeShift: ShiftKasir | null;
  shiftLoading: boolean;
  refreshActiveShift: () => Promise<void>;
  openShift: (kasAwal: number) => Promise<{ success: boolean; error?: string }>;
  closeShift: (uangFisik: number, catatan?: string) => Promise<{ success: boolean; selisih?: number; error?: string }>;
  cart: CartItem[];
  addToCart: (produk: Produk) => void;
  updateQuantity: (produkId: string, qty: number) => void;
  removeFromCart: (produkId: string) => void;
  clearCart: () => void;
  tipePesanan: 'dine_in' | 'takeaway';
  setTipePesanan: (t: 'dine_in' | 'takeaway') => void;
  namaPelanggan: string;
  setNamaPelanggan: (nama: string) => void;
  diskon: number;
  alasanDiskon: string;
  setDiskonInfo: (diskon: number, alasan: string) => void;
  metodeBayar: MetodeBayar;
  setMetodeBayar: (m: MetodeBayar) => void;
  uangDiterima: number;
  setUangDiterima: (val: number) => void;
  subtotal: number;
  total: number;
  kembalian: number;
  processCheckout: () => Promise<{ success: boolean; transaksi?: any; error?: string }>;
  lastTransaksi: any | null;
  showReceipt: boolean;
  setShowReceipt: (show: boolean) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, cabang } = useAuth();
  const [activeShift, setActiveShift] = useState<ShiftKasir | null>(null);
  const [shiftLoading, setShiftLoading] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tipePesanan, setTipePesanan] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [namaPelanggan, setNamaPelanggan] = useState<string>('');
  const [diskon, setDiskon] = useState<number>(0);
  const [alasanDiskon, setAlasanDiskon] = useState<string>('');
  const [metodeBayar, setMetodeBayar] = useState<MetodeBayar>('tunai');
  const [uangDiterima, setUangDiterima] = useState<number>(0);
  const [lastTransaksi, setLastTransaksi] = useState<any | null>(null);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  // Fetch active shift whenever user changes
  const refreshActiveShift = useCallback(async () => {
    if (!profile || profile.peran === 'owner') {
      setActiveShift(null);
      setShiftLoading(false);
      return;
    }
    setShiftLoading(true);
    try {
      // Find shift with status 'buka'
      let query = supabase
        .from('shift_kasir')
        .select('*, cabang(*), kasir:profiles!shift_kasir_kasir_id_fkey(*)')
        .eq('status', 'buka');

      if (profile.peran === 'kasir') {
        query = query.eq('kasir_id', profile.id);
      } else if (profile.cabang_id) {
        query = query.eq('cabang_id', profile.cabang_id);
      }

      const { data, error } = await query.order('dibuka_pada', { ascending: false }).limit(1);

      if (!error && data && data.length > 0) {
        setActiveShift(data[0] as ShiftKasir);
      } else {
        setActiveShift(null);
      }
    } catch (err) {
      console.error('Error fetching active shift:', err);
      setActiveShift(null);
    } finally {
      setShiftLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    refreshActiveShift();
  }, [refreshActiveShift]);

  // BR-01: Buka Shift
  const openShift = async (kasAwal: number) => {
    if (!profile || !profile.cabang_id) {
      return { success: false, error: 'User tidak terikat dengan cabang' };
    }
    if (kasAwal < 0) {
      return { success: false, error: 'Kas awal tidak boleh negatif' };
    }

    try {
      // Check if there is already an open shift
      const { data: existing } = await supabase
        .from('shift_kasir')
        .select('id')
        .eq('kasir_id', profile.id)
        .eq('status', 'buka');

      if (existing && existing.length > 0) {
        return { success: false, error: 'Anda sudah memiliki shift yang masih berstatus buka (BR-01)' };
      }

      const { data, error } = await supabase
        .from('shift_kasir')
        .insert({
          cabang_id: profile.cabang_id,
          kasir_id: profile.id,
          status: 'buka',
          dibuka_pada: new Date().toISOString(),
          kas_awal: kasAwal,
        })
        .select('*, cabang(*), kasir:profiles!shift_kasir_kasir_id_fkey(*)')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      setActiveShift(data as ShiftKasir);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // BR-09: Tutup Shift
  const closeShift = async (uangFisik: number, catatan?: string) => {
    if (!activeShift) {
      return { success: false, error: 'Tidak ada shift aktif untuk ditutup' };
    }

    try {
      // Call RPC rpc_tutup_shift
      const { data, error } = await supabase.rpc('rpc_tutup_shift', {
        p_shift_id: activeShift.id,
        p_uang_fisik: uangFisik,
        p_catatan: catatan || null,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setActiveShift(null);
      await refreshActiveShift();
      return { success: true, selisih: data?.selisih };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Cart operations
  const addToCart = (produk: Produk) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.produk.id === produk.id);
      if (idx >= 0) {
        const item = prev[idx];
        const newQty = Math.min(item.jumlah + 1, 99); // BR-05 max 99
        const next = [...prev];
        next[idx] = {
          ...item,
          jumlah: newQty,
          subtotal: newQty * item.produk.harga_jual,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            produk,
            jumlah: 1,
            subtotal: produk.harga_jual,
          },
        ];
      }
    });
  };

  const updateQuantity = (produkId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(produkId);
      return;
    }
    const safeQty = Math.min(Math.max(qty, 1), 99); // BR-05: 1 s.d. 99
    setCart((prev) =>
      prev.map((item) => {
        if (item.produk.id === produkId) {
          return {
            ...item,
            jumlah: safeQty,
            subtotal: safeQty * item.produk.harga_jual,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (produkId: string) => {
    setCart((prev) => prev.filter((item) => item.produk.id !== produkId));
  };

  const clearCart = () => {
    setCart([]);
    setDiskon(0);
    setAlasanDiskon('');
    setUangDiterima(0);
    setTipePesanan('dine_in');
    setNamaPelanggan('');
  };

  const setDiskonInfo = (nominal: number, alasan: string) => {
    setDiskon(Math.max(0, nominal));
    setAlasanDiskon(alasan);
  };

  const subtotal = cart.reduce((acc, curr) => acc + curr.subtotal, 0);
  const total = Math.max(0, subtotal - diskon);
  const kembalian = metodeBayar === 'tunai' ? Math.max(0, uangDiterima - total) : 0;

  // Real-time synchronization to Customer Facing Display
  useEffect(() => {
    broadcastCustomerDisplay({
      cabangNama: cabang?.nama || activeShift?.cabang?.nama || 'Lumbung Kopi dan Roti',
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
      metodeBayar,
      uangDiterima,
      kembalian,
      status: cart.length > 0 ? 'active' : (lastTransaksi ? 'completed' : 'idle'),
      lastCompletedStruk: lastTransaksi?.nomor_struk,
    });
  }, [
    cabang?.nama,
    activeShift?.cabang?.nama,
    tipePesanan,
    namaPelanggan,
    cart,
    subtotal,
    diskon,
    total,
    metodeBayar,
    uangDiterima,
    kembalian,
    lastTransaksi,
  ]);

  // Process checkout via RPC (BR-02, BR-03, BR-04, BR-05, BR-06, BR-07)
  const processCheckout = async () => {
    if (!profile || !profile.cabang_id) {
      return { success: false, error: 'Pengguna tidak terikat cabang' };
    }
    if (!activeShift) {
      return { success: false, error: 'Shift belum dibuka. Silakan buka shift kasir terlebih dahulu (BR-01).' };
    }
    if (cart.length === 0) {
      return { success: false, error: 'Keranjang belanja masih kosong' };
    }
    if (diskon > subtotal) {
      return { success: false, error: 'Diskon tidak boleh melebihi subtotal (BR-06)' };
    }
    if (diskon > 0 && (!alasanDiskon || alasanDiskon.trim() === '')) {
      return { success: false, error: 'Diskon memerlukan alasan yang jelas (BR-06)' };
    }
    if (metodeBayar === 'tunai' && uangDiterima < total) {
      return { success: false, error: `Uang tunai diterima (Rp${uangDiterima.toLocaleString('id-ID')}) kurang dari total tagihan (Rp${total.toLocaleString('id-ID')}) (BR-07)` };
    }

    const payload: CheckoutPayload = {
      cabang_id: profile.cabang_id,
      shift_id: activeShift.id,
      kasir_id: profile.id,
      metode_bayar: metodeBayar,
      uang_diterima: metodeBayar === 'qris' ? total : uangDiterima,
      diskon: diskon,
      alasan_diskon: diskon > 0 ? alasanDiskon : undefined,
      items: cart.map((c) => ({
        produk_id: c.produk.id,
        nama_produk: c.produk.nama,
        harga_satuan: c.produk.harga_jual,
        jumlah: c.jumlah,
        subtotal: c.subtotal,
      })),
    };

    try {
      const { data, error } = await supabase.rpc('rpc_checkout_transaksi', {
        p_payload: payload,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Checkout succeeded! Format receipt data accurately for ReceiptModal
      const receiptData = {
        id: data.transaksi_id,
        nomor_struk: data.nomor_struk,
        tipe_pesanan: tipePesanan,
        nama_pelanggan: namaPelanggan.trim() || undefined,
        total: data.total ?? total,
        subtotal: subtotal,
        diskon: diskon,
        alasan_diskon: alasanDiskon,
        metode_bayar: metodeBayar,
        uang_diterima: metodeBayar === 'qris' ? (data.total ?? total) : uangDiterima,
        kembalian: data.kembalian ?? kembalian,
        dibuat_pada: new Date().toISOString(),
        items: cart.map((c) => ({
          nama_produk: c.produk.nama,
          jumlah: c.jumlah,
          harga_satuan: c.produk.harga_jual,
          subtotal: c.subtotal,
        })),
        cabang: cabang || activeShift.cabang || {
          nama: 'Lumbung Kopi dan Roti',
          alamat: 'Cabang Toko',
        },
        kasir: profile,
      };

      setLastTransaksi(receiptData);
      broadcastCustomerDisplay({
        cabangNama: receiptData.cabang?.nama || 'Lumbung Kopi dan Roti',
        tipePesanan,
        namaPelanggan,
        items: [],
        subtotal: receiptData.subtotal,
        diskon: receiptData.diskon,
        total: receiptData.total,
        metodeBayar: receiptData.metode_bayar,
        uangDiterima: receiptData.uang_diterima,
        kembalian: receiptData.kembalian,
        status: 'completed',
        lastCompletedStruk: receiptData.nomor_struk,
      });
      setShowReceipt(true);
      clearCart();
      await refreshActiveShift();
      return { success: true, transaksi: receiptData };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <POSContext.Provider
      value={{
        activeShift,
        shiftLoading,
        refreshActiveShift,
        openShift,
        closeShift,
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
        lastTransaksi,
        showReceipt,
        setShowReceipt,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
