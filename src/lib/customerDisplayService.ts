// Customer Facing Display Real-Time Synchronization Service
// Menggunakan BroadcastChannel API dengan fallback ke localStorage StorageEvent

export interface CustomerDisplayItem {
  id: string;
  nama: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

export interface CustomerDisplayPayload {
  cabangNama: string;
  tipePesanan: 'dine_in' | 'takeaway';
  namaPelanggan: string;
  items: CustomerDisplayItem[];
  subtotal: number;
  diskon: number;
  total: number;
  metodeBayar: 'tunai' | 'qris';
  uangDiterima: number;
  kembalian: number;
  status: 'active' | 'completed' | 'idle';
  lastCompletedStruk?: string;
}

const CHANNEL_NAME = 'lumbung_customer_display_channel';
const STORAGE_KEY = 'lumbung_customer_display_state';

let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  channel = new BroadcastChannel(CHANNEL_NAME);
}

export function broadcastCustomerDisplay(payload: CustomerDisplayPayload) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    if (channel) {
      channel.postMessage(payload);
    }
  } catch (err) {
    console.warn('Customer display broadcast error:', err);
  }
}

export function subscribeCustomerDisplay(onUpdate: (payload: CustomerDisplayPayload) => void): () => void {
  // 1. Baca data awal dari storage
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        onUpdate(JSON.parse(raw));
      } catch (e) {
        // ignore parse error
      }
    }
  }

  // 2. Handler untuk pesan BroadcastChannel
  const handleMessage = (e: MessageEvent) => {
    if (e.data) {
      onUpdate(e.data);
    }
  };

  // 3. Handler untuk perubahan storage (antar-tab)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        onUpdate(JSON.parse(e.newValue));
      } catch (err) {
        // ignore
      }
    }
  };

  if (channel) {
    channel.addEventListener('message', handleMessage);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (channel) {
      channel.removeEventListener('message', handleMessage);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}
