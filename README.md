# ☕ Lumbung Kopi dan Roti — Sistem Kasir (POS) Multi-Cabang

> **Sistem Point of Sale (POS) & Manajemen Operasional Terintegrasi Multi-Cabang**  
> Didesain khusus untuk jaringan kedai *Lumbung Kopi dan Roti* dengan 3 cabang aktif: **Tebet (`TBT`)**, **Bintaro (`BTR`)**, dan **Depok (`DPK`)**.

---

## 📌 Latar Belakang & Masalah yang Diselesaikan
Sebelum adanya sistem ini, pencatatan transaksi dan stok dilakukan secara manual di buku dan mesin kasir yang terpisah di masing-masing cabang. Masalah yang sering terjadi:
1. Roti terakhir terjual dua kali karena dua kasir melayani bersamaan (stok minus).
2. Nomor struk ditulis manual sehingga terjadi nomor ganda dan nomor yang terlewat.
3. Uang fisik di laci kasir tidak cocok dengan pembukuan tanpa kejelasan siapa kasir yang bertugas.
4. Pembatalan transaksi (*void*) dilakukan kasir sendiri tanpa persetujuan pimpinan.
5. Pemilik (*Owner*) tidak mengetahui laba bersih harian per cabang karena harga modal harus dirahasiakan dari staf.

Aplikasi ini mengintegrasikan seluruh operasional cabang ke dalam satu sistem berbasis web yang cepat, aman, dan mematuhi seluruh aturan bisnis (BR-01 s/d BR-12).

---

## 🚀 Fitur Utama & Kepatuhan Aturan Bisnis

### 1. Multi-Cabang & Hak Akses Berbasis Peran (RBAC - BR-01)
* **Kasir:** Melayani penjualan, buka/tutup shift miliknya, melihat transaksi & sisa stok cabang sendiri.
* **Kepala Toko:** Mengawasi 1 cabang, approval pembatalan (*void*), verifikasi shift kasir, penyesuaian stok (*stock opname*, barang masuk/rusak), serta melihat laporan penjualan cabang tanpa melihat harga modal.
* **Owner:** Akses penuh seluruh cabang, kelola katalog produk, harga jual & harga modal, laporan laba kotor & margin, kelola akun staf, dan audit log.
* **Proteksi Akun Non-Aktif:** Akun yang dinonaktifkan otomatis ditolak saat masuk.

### 2. Manajemen Shift Kasir & Rekonsiliasi Kas (BR-02, BR-09, BR-10)
* **Wajib Buka Shift:** Transaksi hanya dapat dibuat jika kasir memiliki shift aktif dengan modal kas awal Rp0 s/d Rp2.000.000 (maksimal 1 shift aktif per kasir).
* **Hitung Kas Seharusnya:** Sistem menghitung otomatis: `Kas Seharusnya = Kas Awal + Total Penjualan Tunai Lunas`.
* **Deteksi & Wajib Catatan Selisih Kas:** Jika selisih kas fisik di laci dengan kas sistem melebihi batas toleransi **Rp 20.000**, kasir wajib mengisi catatan penjelasan.
* **Siklus Status Shift Searah:** `buka` ➔ `ditutup` ➔ `diverifikasi` (hanya Kepala Toko atau Owner yang berhak memverifikasi).

### 3. POS Checkout Cepat & Anti Stok Minus (BR-03, BR-04, BR-05, BR-06, BR-07)
* **Proteksi Stok Bersamaan (*Atomic Stock Lock*):** Jika stok suatu item kurang, seluruh transaksi otomatis ditolak. Minuman racikan tidak mengurangi stok bahan baku.
* **Penomoran Struk Otomatis & Unik:** Format standar `KODE-YYYYMMDD-NNNN` (contoh: `TBT-20261025-0001`), urut per cabang per hari tanpa celah.
* **Validasi Diskon Transaksi:** Maksimal diskon 10% dari subtotal dan wajib disertai alasan.
* **Dual Metode Pembayaran:**
  * **Tunai:** Validasi nominal uang diterima harus cukup; kembalian dihitung instan dengan tombol uang pas dan pecahan cepat.
  * **QRIS Statis:** Nominal dikunci pas sesuai total belanja dan menampilkan QR Code untuk dipindai pelanggan.
* **Struk Belanja Thermal:** Cetak langsung ke printer kasir thermal 58mm atau simpan sebagai PDF, lengkap dengan nama kasir, rincian pesanan, dan tipe pesanan (*Dine-in / Takeaway*).

### 4. Otorisasi Ketat Pembatalan Transaksi / Void (BR-08)
* Kasir dilarang membatalkan transaksi.
* Hanya dapat dilakukan oleh **Kepala Toko** cabang terkait atau **Owner**.
* Hanya berlaku untuk transaksi lunas hari ini saat shift kasir masih berstatus buka.
* Wajib mengisi alasan pembatalan minimal 10 karakter.
* Stok produk otomatis dipulihkan (*restocked*) ke cabang.

### 5. Kerahasiaan Finansial & Laporan Bisnis (BR-11)
* **Kerahasiaan Harga Modal:** Harga modal (HPP) dan estimasi laba bersih **hanya dikirim ke peramban Owner**. Kasir dan Kepala Toko tidak dapat melihat angka modal sekalipun memeriksa *Network Tab* peramban.
* **Visualisasi Interaktif:** Grafik penjualan harian per cabang, grafik donat metode bayar (Tunai vs QRIS), dan grafik 10 produk terlaris.
* **Filter Tanggal & Cabang:** Pemantauan omzet harian atau rentang periode tertentu.

### 6. Audit Trail Log yang Tidak Dapat Diubah (BR-12)
* Mencatat otomatis seluruh aksi krusial: *void transaksi, verifikasi shift kasir, penyesuaian stok, perubahan harga produk, dan perubahan status akun*.
* Menyimpan waktu kejadian, pelaku, serta nilai sebelum (*old value*) dan nilai sesudah (*new value*).

---

## 🌟 Fitur Nilai Tambah Inovatif (*Excellence Features*)

1. 🤖 **Lumbung AI Engine (Gemini AI Consultant):**
   * Asisten kecerdasan buatan terintegrasi untuk menganalisis performa toko, evaluasi anomali selisih kas kasir, rekomendasi paket promo *bundling*, dan optimalisasi margin keuntungan.
2. 📈 **Smart Stock Forecasting (Prediksi Kebutuhan Stok):**
   * Prediksi otomatis stok menipis dan rekomendasi jumlah restock besok dengan memperhitungkan rata-rata penjualan dan lonjakan akhir pekan (*weekend demand surge +35%*).
3. 🖥️ **Customer Facing Display (Dual-Screen Real-Time):**
   * Layar kasir sekunder yang menghadap ke pelanggan, tersinkronisasi instan via `BroadcastChannel` (0ms delay) menampilkan keranjang belanja, total bayar, dan QR Code QRIS dinamis.
4. 📑 **Multi-Sheet Excel Export (.XLSX):**
   * Unduh rekapitulasi performa cabang, shift kasir, dan daftar transaksi secara instan dalam format spreadsheet terstruktur.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite
* **Styling & Icons:** Tailwind CSS, Lucide React, Canvas Confetti
* **State Management & Sinkronisasi:** React Context, BroadcastChannel API
* **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Sequences & Triggers)
* **AI Integration:** Google Gemini 1.5 Flash API
* **Hosting & Deployment:** Netlify (dengan proxy redirects Supabase Gateway)

---

## 🔐 Akun Uji Coba Demo (Demo Accounts)

Semua akun demo menggunakan kata sandi yang sama: **`password123`**

| Peran | Nama Pengguna | Email | Cabang |
| :--- | :--- | :--- | :--- |
| **Owner** | Hendra Wijaya | `hendra.owner@lumbung.test` | *Semua Cabang* |
| **Kepala Toko** | Bayu Pratama | `bayu.kt.tebet@lumbung.test` | Tebet (`TBT`) |
| **Kepala Toko** | Ratna Sari | `ratna.kt.btr@lumbung.test` | Bintaro (`BTR`) |
| **Kepala Toko** | Agus Setiawan | `agus.kt.dpk@lumbung.test` | Depok (`DPK`) |
| **Kasir** | Dimas Anggara | `dimas.kasir.tebet@lumbung.test` | Tebet (`TBT`) |
| **Kasir** | Siti Rahma | `siti.kasir.tebet@lumbung.test` | Tebet (`TBT`) |
| **Kasir** | Rian Hidayat | `rian.kasir.btr@lumbung.test` | Bintaro (`BTR`) |
| **Kasir** | Fajar Nugraha | `fajar.kasir.dpk@lumbung.test` | Depok (`DPK`) |
| **Nonaktif** | Dina Kasir Nonaktif | `dina.kasir.btr@lumbung.test` | Bintaro (Ditolak) |

---

## 💻 Panduan Instalasi Lokal

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi Supabase Anda pada `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key # Opsional untuk fitur Lumbung AI
```

### 4. Menyiapkan Database Supabase
Jalankan skrip SQL berikut pada SQL Editor di Supabase Dashboard secara berurutan:
1. `01_schema.sql` — Membuat tabel, relasi, constraint, sequence nomor struk, dan trigger.
2. `02_seed.sql` — Memasukkan data awal cabang, produk, staf, shift, dan transaksi contoh.

### 5. Jalankan Aplikasi
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

---

## 🧪 Pengujian (Test Plan)
Seluruh 16 skenario pengujian aturan bisnis (BR-01 s/d BR-12) telah diuji dan didokumentasikan di berkas:  
📄 **[`docs/test-plan.md`](./docs/test-plan.md)** (Status: **100% PASSED**)

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan Capstone Project Web Programming / Portfolio POS Multi-Cabang.
