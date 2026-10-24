export type Peran = 'kasir' | 'kepala_toko' | 'owner';

export type KategoriProduk = 'kopi' | 'non_kopi' | 'roti' | 'snack' | 'kemasan';

export type StatusShift = 'buka' | 'ditutup' | 'diverifikasi';

export type StatusTransaksi = 'lunas' | 'void' | 'menunggu_bayar' | 'batal';

export type MetodeBayar = 'tunai' | 'qris';

export interface Cabang {
  id: string;
  kode: string;
  nama: string;
  alamat: string;
  aktif: boolean;
  urut_struk_tanggal: string;
  urut_struk_terakhir: number;
}

export interface Profile {
  id: string;
  nama_lengkap: string;
  email: string;
  peran: Peran;
  cabang_id: string | null;
  aktif: boolean;
  dibuat_pada: string;
  cabang?: Cabang | null;
}

export interface Produk {
  id: string;
  sku: string;
  nama: string;
  kategori: KategoriProduk;
  harga_jual: number;
  lacak_stok: boolean;
  aktif: boolean;
  diubah_pada: string;
  stok_saat_ini?: number;
  stok_minimum?: number;
  harga_modal?: number; // Khusus owner
}

export interface StokCabang {
  id: string;
  cabang_id: string;
  produk_id: string;
  jumlah: number;
  stok_minimum: number;
  diubah_pada: string;
  produk?: Produk;
}

export interface ShiftKasir {
  id: string;
  kasir_id: string;
  cabang_id: string;
  waktu_buka: string;
  waktu_tutup: string | null;
  kas_awal: number;
  total_tunai: number | null;
  total_qris: number | null;
  kas_seharusnya: number | null;
  kas_aktual: number | null;
  selisih_kas: number | null;
  status: StatusShift;
  diverifikasi_oleh: string | null;
  waktu_verifikasi: string | null;
  catatan_verifikasi: string | null;
  kasir?: Profile;
  cabang?: Cabang;
  verifikator?: Profile;
}

export interface TransaksiItem {
  id: string;
  transaksi_id: string;
  produk_id: string;
  nama_produk: string;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;
}

export interface Transaksi {
  id: string;
  nomor_struk: string;
  cabang_id: string;
  shift_id: string;
  kasir_id: string;
  status: StatusTransaksi;
  subtotal: number;
  diskon: number;
  alasan_diskon: string | null;
  total: number;
  metode_bayar: MetodeBayar;
  uang_diterima: number;
  kembalian: number;
  dibuat_pada: string;
  dibayar_pada: string | null;
  void_oleh: string | null;
  void_pada: string | null;
  alasan_void: string | null;
  mayar_invoice_id: string | null;
  items?: TransaksiItem[];
  kasir?: Profile;
  cabang?: Cabang;
  pe_void?: Profile;
}

export interface CartItem {
  produk: Produk;
  jumlah: number;
  subtotal: number;
}

export interface CheckoutPayload {
  cabang_id: string;
  shift_id: string;
  kasir_id: string;
  metode_bayar: MetodeBayar;
  uang_diterima: number;
  diskon?: number;
  alasan_diskon?: string;
  items: {
    produk_id: string;
    nama_produk: string;
    harga_satuan: number;
    jumlah: number;
    subtotal: number;
  }[];
}
