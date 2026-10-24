# Test Plan & Matriks Akses POS Multi-Cabang Lumbung Kopi dan Roti
> Proyek Capstone: Aplikasi Kasir (POS) Multi-Cabang (Tebet, Bintaro, Depok)  
> Referensi: PRD Aplikasi Kasir & ERD Lumbung Kopi dan Roti

---

## 1. Matriks Akses Peran (Role Access Matrix)

| Fitur / Halaman | Kasir (KSR) | Kepala Toko (KT) | Owner (OWN) | Keterangan Aturan Bisnis |
| :--- | :---: | :---: | :---: | :--- |
| **Buka Shift & Tutup Shift** | ✅ (Miliknya) | ❌ | ❌ | BR-02, BR-09 (Kas awal Rp0-2jt, catat uang fisik) |
| **Transaksi & Keranjang Kasir** | ✅ (Cabangnya) | ❌ | ❌ | BR-02, BR-03, BR-05, BR-06, BR-07 |
| **Cetak Struk Transaksi** | ✅ | ✅ | ✅ | BR-04 (Format KODE-YYYYMMDD-NNNN urut per cabang) |
| **Daftar Transaksi Cabang** | ✅ (Miliknya) | ✅ (Cabangnya) | ✅ (Semua) | BR-01 |
| **Void Transaksi** | ❌ (Dilarang) | ✅ (Cabangnya) | ✅ (Semua) | BR-08 (Wajib hari ini, shift buka, alasan >= 10 karakter) |
| **Stok & Penyesuaian Stok** | 👁️ (Hanya Lihat) | ✅ (Cabangnya) | ✅ (Semua) | BR-03, BR-12 (Wajib alasan, stok tidak boleh minus) |
| **Verifikasi Shift Kasir** | ❌ | ✅ (Cabangnya) | ✅ (Semua) | BR-10 (Hanya shift status ditutup, urutan buka->tutup->verif) |
| **Kelola Produk & Harga Jual**| ❌ | 👁️ (Hanya Lihat) | ✅ | BR-05, BR-12 |
| **Harga Modal & Laba Bersih** | ❌ (Rahasia) | ❌ (Rahasia) | ✅ | BR-11 (Tidak dikirim ke browser Kasir & Kepala Toko) |
| **Dashboard & Laporan** | ❌ | ✅ (Cabangnya, tanpa laba) | ✅ (Semua + Laba) | Omzet, grafik harian, donat QRIS/Tunai, produk terlaris |
| **Audit Log** | ❌ | ❌ | ✅ | BR-12 (Immutable, mencatat void, shift, stok, harga) |
| **Kelola Pengguna/Staf** | ❌ | ❌ | ✅ | BR-01 (Akun non-aktif ditolak login) |

---

## 2. Daftar 15 Test Case Aturan Bisnis (BR-01 s/d BR-12)

| ID Test | Kategori / Aturan | Skenario Pengujian | Akun Uji | Ekspektasi Hasil | Status Uji |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | **BR-01 (Multi-Cabang)** | Kasir Tebet login, mencoba melihat data transaksi/shift cabang Bintaro atau Depok | `dimas.kasir.tebet@lumbung.test` | Sistem dan RLS hanya menampilkan data cabang Tebet | **PASSED** |
| **TC-02** | **BR-01 (Akun Nonaktif)**| User dengan status `aktif: false` mencoba login ke sistem | `dina.kasir.btr@lumbung.test` | Login ditolak: *"Akun ini berstatus NON-AKTIF"* | **PASSED** |
| **TC-03** | **BR-02 (Shift Tunggal)** | Kasir membuka shift saat shift sebelumnya masih berstatus `buka` | `dimas.kasir.tebet@lumbung.test` | Ditolak: *"Anda sudah memiliki shift yang masih berstatus buka (BR-01)"* | **PASSED** |
| **TC-04** | **BR-02 (Batas Kas Awal)**| Kasir membuka shift dengan nominal negatif atau di atas Rp 2.000.000 | `dimas.kasir.tebet@lumbung.test` | Validasi form memblokir input di luar batas Rp0 s.d Rp2.000.000 | **PASSED** |
| **TC-05** | **BR-02 (Transaksi tanpa shift)** | Kasir mencoba checkout transaksi sebelum membuka shift | Kasir tanpa shift aktif | Tombol checkout terkunci & peringatan *"Shift belum dibuka"* muncul | **PASSED** |
| **TC-06** | **BR-03 (Proteksi Stok)** | Checkout produk stok terbatas melebihi sisa stok yang ada di cabang | `dimas.kasir.tebet@lumbung.test` | Transaksi ditolak seluruhnya, stok tidak boleh minus | **PASSED** |
| **TC-07** | **BR-04 (Nomor Struk)** | Menyimpan transaksi baru di Tebet | `dimas.kasir.tebet@lumbung.test` | Nomor struk otomatis terbentuk: `TBT-YYYYMMDD-NNNN` urut | **PASSED** |
| **TC-08** | **BR-06 (Batas Diskon)** | Kasir memberikan diskon > 10% atau tanpa mengisi alasan diskon | `dimas.kasir.tebet@lumbung.test` | Ditolak: Diskon maksimal 10% dan alasan diskon wajib diisi | **PASSED** |
| **TC-09** | **BR-07 (Bayar Tunai)** | Pembayaran tunai dengan uang diterima kurang dari total belanja | `dimas.kasir.tebet@lumbung.test` | Tombol bayar disabled; kembalian otomatis dihitung jika uang cukup | **PASSED** |
| **TC-10** | **BR-07 (Bayar QRIS)** | Pembayaran QRIS dipilih pada kasir | `dimas.kasir.tebet@lumbung.test` | Nominal pembayaran QRIS terkunci persis sama dengan total tagihan | **PASSED** |
| **TC-11** | **BR-08 (Otorisasi Void)**| Kasir mencoba melakukan void transaksi | `dimas.kasir.tebet@lumbung.test` | Tombol void tidak tersedia untuk peran kasir | **PASSED** |
| **TC-12** | **BR-08 (Validasi Void)** | Kepala Toko melakukan void transaksi dengan alasan < 10 karakter | `bayu.kt.tebet@lumbung.test` | Ditolak: Alasan void minimal 10 karakter; jika sukses stok kembali | **PASSED** |
| **TC-13** | **BR-09 (Tutup Shift)** | Kasir menutup shift dengan selisih kas > Rp 20.000 tanpa catatan | `dimas.kasir.tebet@lumbung.test` | Wajib mengisi catatan tutup shift jika selisih > Rp 20.000 | **PASSED** |
| **TC-14** | **BR-10 (Alur Status Shift)**| Kepala Toko memverifikasi shift yang masih berstatus `buka` | `bayu.kt.tebet@lumbung.test` | Ditolak: Hanya shift berstatus `ditutup` yang dapat diverifikasi | **PASSED** |
| **TC-15** | **BR-11 (Kerahasiaan Modal)**| Kepala Toko atau Kasir membuka konsol/laporan untuk melihat harga modal/laba | `bayu.kt.tebet@lumbung.test` | Kolom modal & laba kotor tidak dikirim dari query backend/DB | **PASSED** |
| **TC-16** | **BR-12 (Audit Log)** | Operasi void, verifikasi shift, dan penyesuaian stok dilakukan | Kepala Toko / Owner | Tercatat otomatis di tabel `audit_log` lengkap nilai sebelum & sesudah | **PASSED** |

---

## 3. Fitur Nilai Tambah (Tahap 9 - Bobot 25%)
- **AI 1: Ask Lumbung AI (LaporanView):** Analisis performa omzet dan rekomendasi bisnis terintegrasi Gemini AI.
- **AI 2: Smart Stock Forecast (StokView):** Prediksi risiko kehabisan stok dan rekomendasi jumlah restock otomatis.
- **Nilai Tambah 1: Customer Facing Display Real-Time & Tipe Pesanan (POSView):** Layar ganda interaktif pelanggan tersinkronisasi 0ms via BroadcastChannel, QRIS besar otomatis, serta mode Dine-In / Takeaway + nama pemesan di struk.
- **Nilai Tambah 2: Multi-Sheet Excel Export (LaporanView):** Unduh rekapitulasi performa cabang, shift, dan penjualan dalam format XLSX rapi.
