# 🎙️ Script Presentasi Capstone Showcase — Lumbung POS
> **Presenter:** Jihan Kusumawardhani  
> **Proyek:** Lumbung Kopi dan Roti — Sistem Kasir (POS) & Manajemen Operasional Multi-Cabang  
> **Estimasi Durasi:** 7 – 10 Menit  
> **Slide Deck Referensi:** [`Template_Slide_Showcase.pptx`](../Template_Slide_Showcase.pptx)

---

## ⏱️ Alokasi Waktu Presentasi (Total: 8–10 Menit)
- **Slide 1 (Pembuka & Perkenalan):** 45 detik
- **Slide 2 (Masalah Nyata Klien & Solusi):** 1 menit
- **Slide 3 (Peran & Matriks Akses RBAC):** 1 menit
- **Slide 4 (Arsitektur & Keamanan Database):** 1 menit
- **Slide 5 & Live Demo (Simulasi 3 Peran Berjalan):** 3 – 4 menit *(Bagian Paling Penting & Dinilai Tinggi)*
- **Slide 6 (Pengujian Keamanan & 16 Test Cases):** 1 menit
- **Slide 7 (4 Fitur Nilai Tambah Inovatif):** 1.5 menit
- **Slide 8 (Pelajaran, Rencana Masa Depan & Penutup):** 45 detik

---

## 🎬 Naskah Presentasi Lengkap (Slide by Slide)

### 🌟 SLIDE 1: Pembuka & Judul Proyek
* **Aksi Tampilan:** Buka Slide 1 *(Lumbung POS — Jihan Kusumawardhani)*.
* **Kata-kata yang Diucapkan:**
> "Selamat pagi/siang kepada Bapak/Ibu dewan juri, mentor, dan rekan-rekan sekalian.  
> 
> Perkenalkan, nama saya **Jihan Kusumawardhani**. Hari ini saya sangat senang dapat mempresentasikan proyek Capstone saya: **Lumbung POS — Sistem Kasir dan Manajemen Operasional Terintegrasi Multi-Cabang untuk jaringan kedai Lumbung Kopi dan Roti**.  
> 
> Aplikasi ini dibangun berbasis web modern, telah tayang secara live, dan seluruh repositori kodenya telah tervalidasi 100% mematuhi seluruh aturan bisnis yang disyaratkan."

---

### 🚨 SLIDE 2: Masalah Klien & Solusi Sistem
* **Aksi Tampilan:** Pindah ke Slide 2 *(Masalah Klien: Masalah Sekarang vs Tujuan Aplikasi)*.
* **Kata-kata yang Diucapkan:**
> "Jaringan Lumbung Kopi dan Roti memiliki 3 cabang aktif di Jabodetabek: **Tebet, Bintaro, dan Depok**. Sebelumnya, setiap cabang masih memakai mesin kasir terpisah dan buku stok manual.  
> 
> Akibatnya, ada 5 masalah nyata di lapangan:
> 1. **Stok Minus:** Roti terakhir terjual dua kali secara bersamaan karena dua kasir melayani di detik yang sama, padahal fisiknya cuma tersisa satu.
> 2. **Nomor Struk Rusak:** Ditulis manual sehingga sering terjadi nomor ganda atau nomor yang hilang.
> 3. **Kas Selisih Tanpa Penanggung Jawab:** Uang fisik di laci kasir sering tidak cocok tanpa rekam jejak siapa kasir yang sedang bertugas.
> 4. **Void Transaksi Liar:** Kasir membatalkan transaksi sendiri tanpa persetujuan pimpinan.
> 5. **Kerahasiaan Modal Terancam:** Pemilik (Owner) tidak bisa memantau laba harian per cabang karena harga modal (HPP) rahasia tidak boleh bocor ke staf kasir.
> 
> **Tujuan aplikasi ini** adalah menggantikan semua sistem manual tersebut dengan satu ekosistem web yang menjamin proteksi stok anti-minus, penomoran struk unik berurutan, siklus shift yang akuntabel, dan pemisahan data laba yang 100% aman."

---

### 👥 SLIDE 3: Peran & Hak Akses Berbasis Cabang (RBAC)
* **Aksi Tampilan:** Pindah ke Slide 3 *(Tabel Hak Akses Peran)*.
* **Kata-kata yang Diucapkan:**
> "Untuk menjawab tantangan tersebut, sistem membagi hak akses ke dalam **3 peran tegas**:
> 
> * **1. Kasir:** Hanya melayani penjualan di cabangnya sendiri. Kasir wajib membuka shift dengan modal kas awal Rp0 sampai Rp2.000.000, melayani pembayaran tunai atau QRIS, mencetak struk thermal, dan menutup shift. Kasir **dilarang keras** melakukan void transaksi dan **tidak memiliki akses sama sekali ke harga modal**.
> * **2. Kepala Toko:** Mengawasi 1 cabang penuh. Bertanggung jawab memverifikasi shift kasir, mencatat penyesuaian stok opname atau barang rusak, serta menjadi pintu otorisasi pembatalan transaksi (void) yang salah input. Kepala Toko juga **tidak bisa melihat harga modal dan laba**.
> * **3. Owner:** Memiliki wewenang lintas seluruh cabang. Hanya Owner yang berhak melihat data laba kotor, margin keuntungan, mengelola katalog produk, harga jual, harga modal, dan memantau jejak audit log.
> 
> Selain itu, jika akun staf dinonaktifkan, sistem secara otomatis menolak akses login seketika sesuai aturan BR-01."

---

### 🏗️ SLIDE 4: Arsitektur & Operasi Sensitif di Database
* **Aksi Tampilan:** Pindah ke Slide 4 *(Tech Stack & Operasi Sensitif yang Dijaga Database)*.
* **Kata-kata yang Diucapkan:**
> "Di balik antarmuka yang modern, arsitektur aplikasi ini dibangun dengan stack terbaik:
> * **Frontend:** Menggunakan **React 19 + TypeScript + Vite**, menghadirkan antarmuka responsif di tablet 10 inci, serta **BroadcastChannel API** untuk sinkronisasi layar ganda pelanggan dengan latensi 0 milidetik.
> * **Backend & Database:** Didukung **Supabase (PostgreSQL 15)** dengan implementasi **Row Level Security (RLS)** dan database sequence.
> 
> Prinsip utama dalam pengembangan aplikasi ini adalah: **Keamanan bisnis tidak boleh hanya mengandalkan frontend.**  
> Ada 3 operasi sensitif yang kami kunci langsung di level database PostgreSQL:
> 1. **Atomic Stock Lock (BR-03):** Pengecekan dan pemotongan stok dijalankan secara atomik. Jika ada 2 kasir menjual roti terakhir bersamaan, database hanya meloloskan kasir tercepat dan menolak transaksi kedua secara utuh, mencegah stok minus.
> 2. **Sequence Nomor Struk (BR-04):** Penomoran format `KODE-YYYYMMDD-NNNN` digenerate langsung oleh database sequence per cabang per hari, sehingga dijamin tidak ada nomor ganda.
> 3. **Kerahasiaan Harga Modal (BR-11):** Kolom harga modal dan estimasi laba difilter di level database/RLS, sehingga kasir atau kepala toko yang memeriksa inspect element peramban tetap tidak akan menemukan angka modal."

---

### 💻 SLIDE 5 & LIVE DEMO: Alur Utama 3 Peran Berjalan
* **Aksi Tampilan:** Pindah ke Slide 5, lalu **beralih ke browser** untuk mendemonstrasikan aplikasi secara live.
* **Kata-kata & Langkah Demo:**

#### ☕ Tahap 1: Kasir Tebet (Dimas Arya)
> *"Sekarang mari kita lihat simulasinya langsung di aplikasi:"*
> 1. Di halaman login, klik tombol akses cepat **KASIR TEBET** (`dimas.kasir.tebet@lumbung.test`).
> 2. Masuk ke menu **Shift Saya**: Tunjukkan bahwa status shift masih tutup dan tombol checkout di POS terkunci.
> 3. Klik tombol **Buka Shift**, masukkan modal kas awal **Rp 100.000**, lalu simpan.
> 4. Pindah ke menu **Kasir (POS)**:
>    - Masukkan produk: **Kopi Susu Lumbung** (minuman racikan) dan **Croissant Mentega** (roti lacak stok).
>    - Tunjukkan tombol **Diskon**: Klik preset 10% dan ketik alasan: `Promo Pelanggan Pertama`. *(Jelaskan: jika diisi 15%, form otomatis memblokir sesuai BR-06).*
>    - Pilih metode bayar **Tunai**: Masukkan uang diterima Rp 50.000, kembalian langsung dihitung otomatis.
>    - Klik **Simpan & Cetak Struk**: Muncul struk thermal bernomor resmi `TBT-20261027-0001` lengkap dengan nama kasir Dimas dan rincian pesanan.
> 5. Kembali ke menu **Shift Saya**: Klik **Tutup Shift**, masukkan uang fisik di laci kasir Rp 140.500, lalu simpan. Status shift berubah dari `buka` menjadi `ditutup`.

#### 📋 Tahap 2: Kepala Toko Tebet (Bayu Prasetyo)
> *"Selanjutnya, kita masuk sebagai Kepala Toko:"*
> 1. Logout lalu klik tombol akses cepat **KEPALA TOKO** (`bayu.kt.tebet@lumbung.test`).
> 2. Buka menu **Shift Cabang**: Terlihat shift Dimas yang baru saja ditutup. Kepala Toko memeriksa selisih kas fisik, lalu mengklik tombol **Verifikasi Shift**. Status shift berubah menjadi `diverifikasi` (final).
> 3. Buka menu **Transaksi**: Kepala Toko melihat daftar transaksi cabang Tebet.
>    - Demonstrasikan fitur **Void**: Klik tombol Void pada salah satu transaksi, masukkan alasan pembatalan minimal 10 karakter: `Pelanggan salah pilih varian kopi`.
>    - Klik Konfirmasi Void: Status transaksi berubah menjadi `void`, nomor struk tetap terjaga, dan stok produk Croissant di cabang Tebet otomatis kembali (*restocked*).

#### 👑 Tahap 3: Owner (Ratna / Hendra)
> *"Terakhir, kita masuk sebagai Owner:"*
> 1. Logout lalu klik tombol akses cepat **OWNER PUSAT** (`ratna.owner@lumbung.test`).
> 2. Buka menu **Laporan**:
>    - Tunjukkan fitur khusus: Hanya di akun Owner muncul **Kartu Laba Kotor & Margin Keuntungan** serta grafik garis estimasi laba per cabang.
>    - Tampilkan filter 3 cabang dan grafik donat perbandingan metode bayar (Tunai vs QRIS).
> 3. Buka menu **Pengaturan > Audit Log**:
>    - Tunjukkan bahwa seluruh aksi void, verifikasi shift, dan penyesuaian stok yang baru saja dilakukan tercatat secara permanen dengan nilai *old value* dan *new value*."

---

### 🛡️ SLIDE 6: Keamanan & Aturan Bisnis yang Diuji (Test Plan)
* **Aksi Tampilan:** Kembali ke Slide 6 *(Keamanan dan Aturan Bisnis yang Diuji)*.
* **Kata-kata yang Diucapkan:**
> "Seluruh keandalan sistem ini telah kami buktikan melalui dokumen **Test Plan** yang mencakup **16 Test Case aturan bisnis (BR-01 sampai BR-12)** dengan status **100% PASSED**.
> 
> Dua pengujian batas paling penting yang berhasil dilewati:
> 1. **Uji Akses Ilegal (TC-02 & TC-15):** Akun staf non-aktif langsung ditolak login dengan pesan peringatan resmi, dan pemeriksaan inspect element di peramban Kasir/Kepala Toko menghasilkan nilai *null* untuk harga modal.
> 2. **Uji Proteksi Stok Anti-Minus (TC-06):** Ketika stok produk tersisa 1 dan dua kasir mencoba checkout pada detik yang sama, hanya satu kasir yang berhasil dan stok menjadi 0, bukan minus. Transaksi kedua ditolak secara utuh."

---

### 🌟 SLIDE 7: Fitur Nilai Tambah Inovatif (Bobot 25%)
* **Aksi Tampilan:** Pindah ke Slide 7 *(Fitur Nilai Tambah)*.
* **Kata-kata yang Diucapkan:**
> "Untuk memberikan nilai tambah bisnis yang nyata, saya menyematkan **4 fitur inovatif**:
> 
> 1. **Real-Time Customer Facing Display:** Layar kedua yang menghadap ke pelanggan. Bekerja tanpa jeda (*0ms delay*) menggunakan `BroadcastChannel API`. Setiap kali kasir memilih menu di POS, layar monitor pelanggan langsung terupdate otomatis menampilkan rincian belanja, menu signature kedai, dan kode QRIS Bank Indonesia yang besar. Setelah bayar, ada animasi centang hijau dan rating kepuasan bintang pelanggan.
> 2. **Lumbung AI Engine (Google Gemini 1.5 Flash):** Asisten kecerdasan buatan di menu Laporan. Owner cukup mengklik 'Ask Lumbung AI' untuk mendapatkan evaluasi omzet, diagnosis selisih kas kasir, rekomendasi paket bundling kopi & roti, serta saran peningkatan margin keuntungan.
> 3. **Smart Stock Forecasting:** Algoritma prediksi stok di menu Stok yang menghitung laju penjualan dan otomatis memperhitungkan *lonjakan akhir pekan (+35% weekend demand surge)* untuk merekomendasikan jumlah restock besok.
> 4. **Multi-Sheet Excel Export (.XLSX):** Satu kali klik di menu Laporan menghasilkan berkas spreadsheet terstruktur berisi: Ringkasan Cabang, Buku Shift Kasir, dan Jurnal Transaksi."

---

### 🎯 SLIDE 8: Pelajaran & Rencana Berikutnya (Penutup)
* **Aksi Tampilan:** Pindah ke Slide 8 *(Pelajaran dan Rencana Berikutnya)*.
* **Kata-kata yang Diucapkan:**
> "Pelajaran paling berharga yang saya dapatkan dalam proyek ini adalah **pentingnya menaruh validasi keamanan di level database (PostgreSQL RLS, database function, atomic lock, dan sequence) daripada hanya mengandalkan frontend logic**. Hal ini menjamin transaksi tidak akan pernah mengalami stok minus maupun kebocoran data harga modal.
> 
> **Rencana pengembangan berikutnya:**
> * Integrasi webhook otomatis untuk penyelesaian pembayaran QRIS Mayar secara real-time.
> * Modul Transfer Stok Antar-Cabang dan notifikasi otomatis WhatsApp saat stok cabang mencapai batas minimum.
> 
> Sekian presentasi dari saya. Terima kasih banyak atas waktu dan perhatian Bapak/Ibu sekalian, silakan jika ada pertanyaan."

---

## 💡 Cheat Sheet: Tanya Jawab Teknis dengan Penguji

| Pertanyaan Penguji | Jawaban Kunci Anda |
| :--- | :--- |
| **Q1: Bagaimana sistem mencegah stok minus saat 2 kasir menjual roti terakhir bersamaan?** | *"Kami menerapkan **Atomic Transaction di level PostgreSQL/Supabase**. Ketika checkout diproses, database mengunci baris stok produk cabang tersebut (*row-level locking*). Jika sisa stok saat pemotongan kurang dari permintaan, database membatalkan seluruh transaksi (*rollback*). Sehingga hanya kasir pertama yang sukses, stok menjadi 0, dan kasir kedua menerima notifikasi stok habis."* |
| **Q2: Bagaimana memastikan kasir tidak bisa mengintip harga modal di Network Tab browser?** | *"Harga modal (HPP) tidak pernah dikirim ke frontend Kasir atau Kepala Toko. Di query backend dan Supabase Row Level Security (RLS), kolom `harga_modal` hanya diizinkan untuk profil dengan peran `owner`. Jadi walaupun staf memeriksa inspect element/Network payload, datanya bernilai null/hilang dari respon JSON."* |
| **Q3: Kenapa menggunakan BroadcastChannel untuk Customer Display bukannya WebSocket?** | *"Karena skenario POS di kedai kopi umumnya adalah **layar ganda di satu mesin/meja kasir yang sama (dual monitor)**. `BroadcastChannel API` berjalan langsung di peramban tanpa perlu koneksi internet atau server pihak ketiga, sehingga **latensinya 0 ms (instan)** dan tidak membebani kuota data toko."* |
| **Q4: Bagaimana aturan nomor struk BR-04 dijamin tidak loncat atau ganda?** | *"Nomor struk dibuat menggunakan format `KODE-YYYYMMDD-NNNN`. Bagian urutan 4 digit terakhir digenerate oleh **Database Sequence PostgreSQL** yang di-reset per cabang per tanggal. Database sequence memiliki sifat atomic counter yang dijamin unik meskipun ada ribuan transaksi disimpan serentak."* |
| **Q5: Apa yang terjadi jika kasir menutup shift dengan selisih uang fisik lebih dari Rp 20.000?** | *"Sesuai aturan BR-09, sistem secara otomatis mendeteksi jika selisih kas fisik dengan kas sistem melebihi batas toleransi Rp 20.000 (baik lebih maupun kurang). Form tutup shift akan **mengunci tombol simpan dan mewajibkan kasir mengisi catatan penjelasan** alasan selisih tersebut sebelum kasir dapat menyerahkan laci kasir."* |
