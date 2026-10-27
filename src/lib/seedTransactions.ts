import type { Transaksi, ShiftKasir } from '../types/database';

export const SEED_TRANSAKSI: Transaksi[] = [
  {
    "id": "f5b01356-cc99-5714-86d8-589520461e3b",
    "nomor_struk": "TBT-20261001-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "9743fdd1-c665-5f65-b90e-640180638180",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 98000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 98000,
    "metode_bayar": "tunai",
    "uang_diterima": 100000,
    "kembalian": 2000,
    "void_oleh": "2026-10-01T07:56:00+07:00",
    "alasan_void": "2026-10-01T07:56:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "376c2b9e-4922-5ec7-9ab6-aaaa030a4411",
        "transaksi_id": "f5b01356-cc99-5714-86d8-589520461e3b",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "74b7bd04-a7c6-5e48-9f89-1deed0f1b1f1",
        "transaksi_id": "f5b01356-cc99-5714-86d8-589520461e3b",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      },
      {
        "id": "06484457-d66a-5ccb-89ed-b3e13eff3254",
        "transaksi_id": "f5b01356-cc99-5714-86d8-589520461e3b",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      }
    ]
  },
  {
    "id": "4341a6ee-503e-58e6-84e6-f0ab928ea551",
    "nomor_struk": "TBT-20261001-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "9743fdd1-c665-5f65-b90e-640180638180",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 66000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 66000,
    "metode_bayar": "tunai",
    "uang_diterima": 100000,
    "kembalian": 34000,
    "void_oleh": "2026-10-01T09:39:00+07:00",
    "alasan_void": "2026-10-01T09:39:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "4f674074-6ffd-59b2-8aab-e38cd1fc8847",
        "transaksi_id": "4341a6ee-503e-58e6-84e6-f0ab928ea551",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 3,
        "subtotal": 66000
      }
    ]
  },
  {
    "id": "9b066bdb-0abd-59e1-91a1-141463e23741",
    "nomor_struk": "TBT-20261001-0003",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "9743fdd1-c665-5f65-b90e-640180638180",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 209000,
    "diskon": 20900,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 188100,
    "metode_bayar": "qris",
    "uang_diterima": 188100,
    "kembalian": 0,
    "void_oleh": "2026-10-01T11:18:00+07:00",
    "alasan_void": "2026-10-01T11:18:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "e9672763-bf95-5770-b0d9-344ffae7fe55",
        "transaksi_id": "9b066bdb-0abd-59e1-91a1-141463e23741",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 3,
        "subtotal": 75000
      },
      {
        "id": "2eebb190-007a-5a96-867f-7104dacabec1",
        "transaksi_id": "9b066bdb-0abd-59e1-91a1-141463e23741",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      },
      {
        "id": "d9bbff57-39b1-51f9-8481-bd516b6e6a42",
        "transaksi_id": "9b066bdb-0abd-59e1-91a1-141463e23741",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 1,
        "subtotal": 22000
      },
      {
        "id": "2c96ae22-5f53-5564-8710-80759bebef17",
        "transaksi_id": "9b066bdb-0abd-59e1-91a1-141463e23741",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      }
    ]
  },
  {
    "id": "4f42a80f-2412-5c82-9382-e99e323e6147",
    "nomor_struk": "TBT-20261003-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "ad29fb45-0972-50b5-8ffa-1a99e2c614df",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 96000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 96000,
    "metode_bayar": "qris",
    "uang_diterima": 96000,
    "kembalian": 0,
    "void_oleh": "2026-10-03T08:21:00+07:00",
    "alasan_void": "2026-10-03T08:21:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "a6342d4e-e410-5e11-98a8-ae1425496598",
        "transaksi_id": "4f42a80f-2412-5c82-9382-e99e323e6147",
        "produk_id": "f26530f3-0a9b-5b26-9136-750b5a5f55c0",
        "nama_produk": "Donat Gula Halus",
        "harga_satuan": 10000,
        "jumlah": 1,
        "subtotal": 10000
      },
      {
        "id": "1870d3fa-beab-50d0-b10e-7d0206cbc70d",
        "transaksi_id": "4f42a80f-2412-5c82-9382-e99e323e6147",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "7b300a29-e4bd-52b4-ba87-6263a5d629eb",
        "transaksi_id": "4f42a80f-2412-5c82-9382-e99e323e6147",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 1,
        "subtotal": 30000
      }
    ]
  },
  {
    "id": "f4dd343a-bda9-5460-9a47-19b442b1735e",
    "nomor_struk": "TBT-20261003-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "ad29fb45-0972-50b5-8ffa-1a99e2c614df",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 80000,
    "diskon": 5000,
    "alasan_diskon": "Bawa tumbler sendiri",
    "total": 75000,
    "metode_bayar": "qris",
    "uang_diterima": 75000,
    "kembalian": 0,
    "void_oleh": "2026-10-03T10:20:00+07:00",
    "alasan_void": "2026-10-03T10:20:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "7b891e16-63f5-5b32-99e5-c8bf9ef37b62",
        "transaksi_id": "f4dd343a-bda9-5460-9a47-19b442b1735e",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 1,
        "subtotal": 24000
      },
      {
        "id": "ce1943c1-ad04-5836-b6e1-da1dee71e1ff",
        "transaksi_id": "f4dd343a-bda9-5460-9a47-19b442b1735e",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      }
    ]
  },
  {
    "id": "4b45c20e-3311-5c84-8687-91357aa4a630",
    "nomor_struk": "TBT-20261003-0003",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "ad29fb45-0972-50b5-8ffa-1a99e2c614df",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 69000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 69000,
    "metode_bayar": "qris",
    "uang_diterima": 69000,
    "kembalian": 0,
    "void_oleh": "2026-10-03T11:59:00+07:00",
    "alasan_void": "2026-10-03T11:59:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "d3e1b7c7-0023-5274-b6b6-10baa851d886",
        "transaksi_id": "4b45c20e-3311-5c84-8687-91357aa4a630",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      },
      {
        "id": "3b7e0f0a-4c1d-56db-91c1-7e76072622aa",
        "transaksi_id": "4b45c20e-3311-5c84-8687-91357aa4a630",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      }
    ]
  },
  {
    "id": "63ba2441-5f3d-5209-baac-0d7ad80cf823",
    "nomor_struk": "TBT-20261005-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "2982fc29-e3c5-558a-82b5-ab2cb697b3d4",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 113000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 113000,
    "metode_bayar": "tunai",
    "uang_diterima": 113000,
    "kembalian": 0,
    "void_oleh": "2026-10-05T09:01:00+07:00",
    "alasan_void": "2026-10-05T09:01:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "39503065-f6bd-5a70-9d91-bea8457b4db7",
        "transaksi_id": "63ba2441-5f3d-5209-baac-0d7ad80cf823",
        "produk_id": "2d5fb5b3-fa19-5c74-b13a-04cf2bc8234e",
        "nama_produk": "Kopi Susu Botol 1 L",
        "harga_satuan": 95000,
        "jumlah": 1,
        "subtotal": 95000
      },
      {
        "id": "75818e72-4937-55cc-992c-3c16ed147dd0",
        "transaksi_id": "63ba2441-5f3d-5209-baac-0d7ad80cf823",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 1,
        "subtotal": 18000
      }
    ]
  },
  {
    "id": "26d50f28-a941-50bb-ab17-212da52a50ec",
    "nomor_struk": "TBT-20261005-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "2982fc29-e3c5-558a-82b5-ab2cb697b3d4",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 112000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 112000,
    "metode_bayar": "qris",
    "uang_diterima": 112000,
    "kembalian": 0,
    "void_oleh": "2026-10-05T10:48:00+07:00",
    "alasan_void": "2026-10-05T10:48:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "38141ecd-6353-5c42-b1af-18d34cda0bda",
        "transaksi_id": "26d50f28-a941-50bb-ab17-212da52a50ec",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "86c69d80-af03-50f8-b798-efe3265a8bd9",
        "transaksi_id": "26d50f28-a941-50bb-ab17-212da52a50ec",
        "produk_id": "e492a9b2-879d-503d-89bc-2b2d47be0ab4",
        "nama_produk": "Banana Cake Slice",
        "harga_satuan": 22000,
        "jumlah": 3,
        "subtotal": 66000
      },
      {
        "id": "a27203f9-b56b-593e-ae9e-5d9fb3b48823",
        "transaksi_id": "26d50f28-a941-50bb-ab17-212da52a50ec",
        "produk_id": "ff9dd343-b627-5a17-a177-1a1d23e3439d",
        "nama_produk": "Espresso",
        "harga_satuan": 18000,
        "jumlah": 1,
        "subtotal": 18000
      }
    ]
  },
  {
    "id": "a6247e76-cdcf-590c-87b8-faae7182b042",
    "nomor_struk": "TBT-20261007-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "3b4b07cf-ae85-570a-a830-09660552ad2d",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 28000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 28000,
    "metode_bayar": "qris",
    "uang_diterima": 28000,
    "kembalian": 0,
    "void_oleh": "2026-10-07T08:33:00+07:00",
    "alasan_void": "2026-10-07T08:33:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "5d5d0a4f-f24e-5a4b-ba1e-38d3856542ac",
        "transaksi_id": "a6247e76-cdcf-590c-87b8-faae7182b042",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      }
    ]
  },
  {
    "id": "0450df2f-28c7-54c9-9126-528ecae8f8aa",
    "nomor_struk": "TBT-20261007-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "3b4b07cf-ae85-570a-a830-09660552ad2d",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 143000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 143000,
    "metode_bayar": "qris",
    "uang_diterima": 143000,
    "kembalian": 0,
    "void_oleh": "2026-10-07T09:33:00+07:00",
    "alasan_void": "2026-10-07T09:33:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "1f609ff8-4a1a-518b-a09c-ee9e6faa3526",
        "transaksi_id": "0450df2f-28c7-54c9-9126-528ecae8f8aa",
        "produk_id": "2d5fb5b3-fa19-5c74-b13a-04cf2bc8234e",
        "nama_produk": "Kopi Susu Botol 1 L",
        "harga_satuan": 95000,
        "jumlah": 1,
        "subtotal": 95000
      },
      {
        "id": "f7116f88-6be9-508d-8309-839046fa228f",
        "transaksi_id": "0450df2f-28c7-54c9-9126-528ecae8f8aa",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 2,
        "subtotal": 48000
      }
    ]
  },
  {
    "id": "abab1c02-1243-5a01-983c-eaa394b5a61c",
    "nomor_struk": "TBT-20261009-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "0f0047ec-d203-5284-87e3-0f1263df9a0a",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 194000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 194000,
    "metode_bayar": "tunai",
    "uang_diterima": 200000,
    "kembalian": 6000,
    "void_oleh": "2026-10-09T09:08:00+07:00",
    "alasan_void": "2026-10-09T09:08:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "6226dff2-9e2d-5cf7-a5a0-6886ca02064c",
        "transaksi_id": "abab1c02-1243-5a01-983c-eaa394b5a61c",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      },
      {
        "id": "f2053487-d397-58d2-90a6-04faf0d4546b",
        "transaksi_id": "abab1c02-1243-5a01-983c-eaa394b5a61c",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "24de9061-af37-5452-aff1-858df40a4efe",
        "transaksi_id": "abab1c02-1243-5a01-983c-eaa394b5a61c",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 2,
        "subtotal": 60000
      }
    ]
  },
  {
    "id": "1b560332-956a-5f8b-8635-d51fe9036685",
    "nomor_struk": "TBT-20261009-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "0f0047ec-d203-5284-87e3-0f1263df9a0a",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 139000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 139000,
    "metode_bayar": "qris",
    "uang_diterima": 139000,
    "kembalian": 0,
    "void_oleh": "2026-10-09T10:09:00+07:00",
    "alasan_void": "2026-10-09T10:09:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "c39a782c-11c3-52b2-b800-49eb56acd25e",
        "transaksi_id": "1b560332-956a-5f8b-8635-d51fe9036685",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 2,
        "subtotal": 48000
      },
      {
        "id": "c2cb0291-205d-58a9-b00b-50eeab8dff10",
        "transaksi_id": "1b560332-956a-5f8b-8635-d51fe9036685",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "00855810-6b02-5af9-a4f9-d62715bf87d3",
        "transaksi_id": "1b560332-956a-5f8b-8635-d51fe9036685",
        "produk_id": "2b967038-d218-54c7-9c5f-26a893e01f11",
        "nama_produk": "Cookies Oat Madu (isi 6)",
        "harga_satuan": 35000,
        "jumlah": 1,
        "subtotal": 35000
      }
    ]
  },
  {
    "id": "e0fba506-41a1-5d1f-87b5-582046175493",
    "nomor_struk": "TBT-20261011-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "6d671e28-91fb-5278-8425-9262b0a26adb",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 79000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 79000,
    "metode_bayar": "qris",
    "uang_diterima": 79000,
    "kembalian": 0,
    "void_oleh": "2026-10-11T09:10:00+07:00",
    "alasan_void": "2026-10-11T09:10:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "51ba4da0-ee57-5644-bc8c-0cba64d887cc",
        "transaksi_id": "e0fba506-41a1-5d1f-87b5-582046175493",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 3,
        "subtotal": 54000
      },
      {
        "id": "aa7b140a-52e0-5c9a-8fa2-4e5d0a996cff",
        "transaksi_id": "e0fba506-41a1-5d1f-87b5-582046175493",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      }
    ]
  },
  {
    "id": "d151d666-3aa7-5383-8afe-0e4e88680fa8",
    "nomor_struk": "TBT-20261011-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "6d671e28-91fb-5278-8425-9262b0a26adb",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 151000,
    "diskon": 5000,
    "alasan_diskon": "Bawa tumbler sendiri",
    "total": 146000,
    "metode_bayar": "tunai",
    "uang_diterima": 200000,
    "kembalian": 54000,
    "void_oleh": "2026-10-11T10:24:00+07:00",
    "alasan_void": "2026-10-11T10:24:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "07c6ca7c-8167-5bb8-995e-06b6bbb7955c",
        "transaksi_id": "d151d666-3aa7-5383-8afe-0e4e88680fa8",
        "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
        "nama_produk": "Cokelat Panas",
        "harga_satuan": 27000,
        "jumlah": 3,
        "subtotal": 81000
      },
      {
        "id": "0de69435-36da-5384-a1ca-d69222e91040",
        "transaksi_id": "d151d666-3aa7-5383-8afe-0e4e88680fa8",
        "produk_id": "2b967038-d218-54c7-9c5f-26a893e01f11",
        "nama_produk": "Cookies Oat Madu (isi 6)",
        "harga_satuan": 35000,
        "jumlah": 1,
        "subtotal": 35000
      },
      {
        "id": "21b0f154-ce9a-5905-a4ec-b63978ec82e6",
        "transaksi_id": "d151d666-3aa7-5383-8afe-0e4e88680fa8",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      },
      {
        "id": "60bfb830-b7cd-590b-a77f-f89b446c0d7a",
        "transaksi_id": "d151d666-3aa7-5383-8afe-0e4e88680fa8",
        "produk_id": "f26530f3-0a9b-5b26-9136-750b5a5f55c0",
        "nama_produk": "Donat Gula Halus",
        "harga_satuan": 10000,
        "jumlah": 1,
        "subtotal": 10000
      }
    ]
  },
  {
    "id": "a4298492-f47d-5996-988e-210bfe15c74a",
    "nomor_struk": "TBT-20261011-0003",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "6d671e28-91fb-5278-8425-9262b0a26adb",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "void",
    "subtotal": 136000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 136000,
    "metode_bayar": "qris",
    "uang_diterima": 136000,
    "kembalian": 0,
    "void_oleh": "2026-10-11T11:14:00+07:00",
    "alasan_void": "2026-10-11T11:14:40+07:00",
    "void_pada": "2026-10-11T11:20:00+07:00",
    "dibuat_pada": "Pelanggan batal sebelum pesanan dibuat",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "a629ce18-4cb7-5f20-a89d-f16977d39206",
        "transaksi_id": "a4298492-f47d-5996-988e-210bfe15c74a",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 1,
        "subtotal": 30000
      },
      {
        "id": "1b61e9f0-4219-5226-bae5-b55b5916a68e",
        "transaksi_id": "a4298492-f47d-5996-988e-210bfe15c74a",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 2,
        "subtotal": 48000
      },
      {
        "id": "c5365c02-4b5d-52ac-abd7-44092ef8ca12",
        "transaksi_id": "a4298492-f47d-5996-988e-210bfe15c74a",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 1,
        "subtotal": 22000
      },
      {
        "id": "656cff43-dadd-5ad6-a1b7-8df823349712",
        "transaksi_id": "a4298492-f47d-5996-988e-210bfe15c74a",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 2,
        "subtotal": 36000
      }
    ]
  },
  {
    "id": "d3027ca4-80af-53e8-bca5-50747f4b1bad",
    "nomor_struk": "TBT-20261013-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "4d403b88-4ef9-5c79-8f54-cdfccbb5fb90",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 66000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 66000,
    "metode_bayar": "tunai",
    "uang_diterima": 70000,
    "kembalian": 4000,
    "void_oleh": "2026-10-13T08:52:00+07:00",
    "alasan_void": "2026-10-13T08:52:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "07db76f8-dc68-5d99-a86e-8a002862dd41",
        "transaksi_id": "d3027ca4-80af-53e8-bca5-50747f4b1bad",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 3,
        "subtotal": 66000
      }
    ]
  },
  {
    "id": "0a39d25d-441b-5d7c-abc9-cdb7dda9eaff",
    "nomor_struk": "TBT-20261013-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "4d403b88-4ef9-5c79-8f54-cdfccbb5fb90",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 72000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 72000,
    "metode_bayar": "tunai",
    "uang_diterima": 100000,
    "kembalian": 28000,
    "void_oleh": "2026-10-13T10:00:00+07:00",
    "alasan_void": "2026-10-13T10:00:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "f712036f-d2c0-54fa-af06-17c990268ef9",
        "transaksi_id": "0a39d25d-441b-5d7c-abc9-cdb7dda9eaff",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 3,
        "subtotal": 72000
      }
    ]
  },
  {
    "id": "6d534e88-8b64-55b6-9849-b14cada5c919",
    "nomor_struk": "TBT-20261013-0003",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "4d403b88-4ef9-5c79-8f54-cdfccbb5fb90",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 206000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 206000,
    "metode_bayar": "qris",
    "uang_diterima": 206000,
    "kembalian": 0,
    "void_oleh": "2026-10-13T11:36:00+07:00",
    "alasan_void": "2026-10-13T11:36:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "c50b3c38-7f85-5572-8d3b-25b680028a7e",
        "transaksi_id": "6d534e88-8b64-55b6-9849-b14cada5c919",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 1,
        "subtotal": 24000
      },
      {
        "id": "df34a980-50a9-5a95-9861-14a799da04e4",
        "transaksi_id": "6d534e88-8b64-55b6-9849-b14cada5c919",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 3,
        "subtotal": 90000
      },
      {
        "id": "38472571-b33c-5518-b28c-6ff329fea909",
        "transaksi_id": "6d534e88-8b64-55b6-9849-b14cada5c919",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "d27a39a5-4990-55a9-9ee8-a3a92699faa0",
        "transaksi_id": "6d534e88-8b64-55b6-9849-b14cada5c919",
        "produk_id": "ff9dd343-b627-5a17-a177-1a1d23e3439d",
        "nama_produk": "Espresso",
        "harga_satuan": 18000,
        "jumlah": 2,
        "subtotal": 36000
      }
    ]
  },
  {
    "id": "7e735920-af82-54db-a360-21a23954952a",
    "nomor_struk": "TBT-20261014-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "cf72ee97-5064-5b23-b04b-713fb2626d7a",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 139000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 139000,
    "metode_bayar": "tunai",
    "uang_diterima": 200000,
    "kembalian": 61000,
    "void_oleh": "2026-10-14T09:00:00+07:00",
    "alasan_void": "2026-10-14T09:00:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "820bc222-5006-5916-a897-c7ebf5870af1",
        "transaksi_id": "7e735920-af82-54db-a360-21a23954952a",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 3,
        "subtotal": 54000
      },
      {
        "id": "e86c590c-78e3-5de5-b858-4be868a13f24",
        "transaksi_id": "7e735920-af82-54db-a360-21a23954952a",
        "produk_id": "71c22606-2702-558e-b464-92af2dca8071",
        "nama_produk": "Biji Kopi Lumbung 250 g",
        "harga_satuan": 85000,
        "jumlah": 1,
        "subtotal": 85000
      }
    ]
  },
  {
    "id": "f687a7f7-2470-5f54-bf8f-f32e1cc93f18",
    "nomor_struk": "TBT-20261014-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "cf72ee97-5064-5b23-b04b-713fb2626d7a",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 151000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 151000,
    "metode_bayar": "qris",
    "uang_diterima": 151000,
    "kembalian": 0,
    "void_oleh": "2026-10-14T09:46:00+07:00",
    "alasan_void": "2026-10-14T09:46:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "84936470-0497-53c4-afc0-895db657cdb0",
        "transaksi_id": "f687a7f7-2470-5f54-bf8f-f32e1cc93f18",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "091a5496-09d5-57e6-95bc-9746575b57c3",
        "transaksi_id": "f687a7f7-2470-5f54-bf8f-f32e1cc93f18",
        "produk_id": "2d5fb5b3-fa19-5c74-b13a-04cf2bc8234e",
        "nama_produk": "Kopi Susu Botol 1 L",
        "harga_satuan": 95000,
        "jumlah": 1,
        "subtotal": 95000
      }
    ]
  },
  {
    "id": "fbc6b3c2-e050-5575-b2eb-5994692e29f9",
    "nomor_struk": "TBT-20261014-0003",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "cf72ee97-5064-5b23-b04b-713fb2626d7a",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "lunas",
    "subtotal": 45000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 45000,
    "metode_bayar": "tunai",
    "uang_diterima": 50000,
    "kembalian": 5000,
    "void_oleh": "2026-10-14T10:46:00+07:00",
    "alasan_void": "2026-10-14T10:46:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "28779a92-7c39-5fcc-8a7f-6dceeb21248a",
        "transaksi_id": "fbc6b3c2-e050-5575-b2eb-5994692e29f9",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      },
      {
        "id": "a9d8d10b-09e5-5585-b749-9693bb223a47",
        "transaksi_id": "fbc6b3c2-e050-5575-b2eb-5994692e29f9",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      }
    ]
  },
  {
    "id": "8e1ce010-3229-5230-9cd0-af5051c365a1",
    "nomor_struk": "TBT-20261015-0001",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "abd84bfa-186b-5825-bfae-330b162e3877",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 106000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 106000,
    "metode_bayar": "qris",
    "uang_diterima": 106000,
    "kembalian": 0,
    "void_oleh": "2026-10-15T09:18:00+07:00",
    "alasan_void": "2026-10-15T09:18:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "a79e7592-9394-56b3-91a9-2e4f66713952",
        "transaksi_id": "8e1ce010-3229-5230-9cd0-af5051c365a1",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 1,
        "subtotal": 30000
      },
      {
        "id": "371a923f-a37e-5374-ad84-aaab4651cebe",
        "transaksi_id": "8e1ce010-3229-5230-9cd0-af5051c365a1",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "d2dc0b4e-e748-53b5-9b25-313b2c810f5c",
        "transaksi_id": "8e1ce010-3229-5230-9cd0-af5051c365a1",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      }
    ]
  },
  {
    "id": "4cede481-fee9-5680-aab6-59c9020a2ed6",
    "nomor_struk": "TBT-20261015-0002",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "abd84bfa-186b-5825-bfae-330b162e3877",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 132000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 132000,
    "metode_bayar": "qris",
    "uang_diterima": 132000,
    "kembalian": 0,
    "void_oleh": "2026-10-15T11:01:00+07:00",
    "alasan_void": "2026-10-15T11:01:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "7c7cf7ed-ebed-59c7-b2ef-b498145a301f",
        "transaksi_id": "4cede481-fee9-5680-aab6-59c9020a2ed6",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 2,
        "subtotal": 60000
      },
      {
        "id": "4ee0c0fa-b7ea-5de3-9bfd-5cf7a88134fa",
        "transaksi_id": "4cede481-fee9-5680-aab6-59c9020a2ed6",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 3,
        "subtotal": 72000
      }
    ]
  },
  {
    "id": "1631a1fd-27b4-546f-91d5-10b8b5486681",
    "nomor_struk": "TBT-20261015-0003",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "shift_id": "abd84bfa-186b-5825-bfae-330b162e3877",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "lunas",
    "subtotal": 146000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 146000,
    "metode_bayar": "tunai",
    "uang_diterima": 200000,
    "kembalian": 54000,
    "void_oleh": "2026-10-15T12:16:00+07:00",
    "alasan_void": "2026-10-15T12:16:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    },
    "items": [
      {
        "id": "87ea5a0a-e228-5478-a43e-37c8b498889d",
        "transaksi_id": "1631a1fd-27b4-546f-91d5-10b8b5486681",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "9c60f83c-6bb6-5b15-a668-00ded25543a6",
        "transaksi_id": "1631a1fd-27b4-546f-91d5-10b8b5486681",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "19901a16-fbb2-5b59-9e32-2137b63de72c",
        "transaksi_id": "1631a1fd-27b4-546f-91d5-10b8b5486681",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 3,
        "subtotal": 90000
      }
    ]
  },
  {
    "id": "3d0a82b2-98aa-567f-8892-33699147d6e7",
    "nomor_struk": "BTR-20261002-0001",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "2c1463a3-9cba-5e61-8e37-384bd763e0ce",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 239000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 239000,
    "metode_bayar": "tunai",
    "uang_diterima": 500000,
    "kembalian": 261000,
    "void_oleh": "2026-10-02T08:16:00+07:00",
    "alasan_void": "2026-10-02T08:16:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "a476d725-6ee2-5617-9148-a2fd2e4bf5ce",
        "transaksi_id": "3d0a82b2-98aa-567f-8892-33699147d6e7",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "8ecb0751-d2c7-5dd4-abd7-d76a3885a75a",
        "transaksi_id": "3d0a82b2-98aa-567f-8892-33699147d6e7",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 3,
        "subtotal": 75000
      },
      {
        "id": "82e5b52f-2f5f-5c31-8a98-21e651c5d51c",
        "transaksi_id": "3d0a82b2-98aa-567f-8892-33699147d6e7",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 3,
        "subtotal": 72000
      },
      {
        "id": "6b029e46-0632-560b-9221-7700f9fa9fa7",
        "transaksi_id": "3d0a82b2-98aa-567f-8892-33699147d6e7",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 2,
        "subtotal": 36000
      }
    ]
  },
  {
    "id": "e7102c4f-93c6-55f8-ba9a-5c548d17e178",
    "nomor_struk": "BTR-20261002-0002",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "2c1463a3-9cba-5e61-8e37-384bd763e0ce",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 203000,
    "diskon": 5000,
    "alasan_diskon": "Bawa tumbler sendiri",
    "total": 198000,
    "metode_bayar": "tunai",
    "uang_diterima": 200000,
    "kembalian": 2000,
    "void_oleh": "2026-10-02T09:17:00+07:00",
    "alasan_void": "2026-10-02T09:17:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "6ac8819f-2609-5450-8880-761a26aec849",
        "transaksi_id": "e7102c4f-93c6-55f8-ba9a-5c548d17e178",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 1,
        "subtotal": 24000
      },
      {
        "id": "4d2f81fd-312e-5a79-80b7-7978389464fa",
        "transaksi_id": "e7102c4f-93c6-55f8-ba9a-5c548d17e178",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      },
      {
        "id": "4f5332eb-1f56-5eb3-adcb-748249932d08",
        "transaksi_id": "e7102c4f-93c6-55f8-ba9a-5c548d17e178",
        "produk_id": "71c22606-2702-558e-b464-92af2dca8071",
        "nama_produk": "Biji Kopi Lumbung 250 g",
        "harga_satuan": 85000,
        "jumlah": 1,
        "subtotal": 85000
      },
      {
        "id": "fef9c779-80ba-5e00-9668-907ad17909c3",
        "transaksi_id": "e7102c4f-93c6-55f8-ba9a-5c548d17e178",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      }
    ]
  },
  {
    "id": "857140d4-6cb9-545c-b46c-0a43385b4be5",
    "nomor_struk": "BTR-20261002-0003",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "2c1463a3-9cba-5e61-8e37-384bd763e0ce",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 222000,
    "diskon": 5000,
    "alasan_diskon": "Bawa tumbler sendiri",
    "total": 217000,
    "metode_bayar": "qris",
    "uang_diterima": 217000,
    "kembalian": 0,
    "void_oleh": "2026-10-02T10:00:00+07:00",
    "alasan_void": "2026-10-02T10:00:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "3a27344c-23ff-5749-9522-68d4ea575d52",
        "transaksi_id": "857140d4-6cb9-545c-b46c-0a43385b4be5",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      },
      {
        "id": "d38bc635-1f65-58fb-a8c9-6f0c4978bf5a",
        "transaksi_id": "857140d4-6cb9-545c-b46c-0a43385b4be5",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "b5c0bfb4-891b-54e9-be0e-f90ae61128f1",
        "transaksi_id": "857140d4-6cb9-545c-b46c-0a43385b4be5",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "489b8225-fa7a-57e8-8f5f-0a7454626f9b",
        "transaksi_id": "857140d4-6cb9-545c-b46c-0a43385b4be5",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 2,
        "subtotal": 60000
      }
    ]
  },
  {
    "id": "20325b26-04f9-5039-a9fd-0d3ffc17c93b",
    "nomor_struk": "BTR-20261004-0001",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "6d38a26d-43e7-5358-98af-f47637826b0c",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 90000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 90000,
    "metode_bayar": "qris",
    "uang_diterima": 90000,
    "kembalian": 0,
    "void_oleh": "2026-10-04T08:43:00+07:00",
    "alasan_void": "2026-10-04T08:43:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "7018ed5f-b25a-5ab9-a638-e982849b5adc",
        "transaksi_id": "20325b26-04f9-5039-a9fd-0d3ffc17c93b",
        "produk_id": "2b967038-d218-54c7-9c5f-26a893e01f11",
        "nama_produk": "Cookies Oat Madu (isi 6)",
        "harga_satuan": 35000,
        "jumlah": 2,
        "subtotal": 70000
      },
      {
        "id": "a1fb23a6-4b37-5036-a74e-fa2bb5ab4bad",
        "transaksi_id": "20325b26-04f9-5039-a9fd-0d3ffc17c93b",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      }
    ]
  },
  {
    "id": "ebc65db9-350f-5284-b501-cf2fb978ed7e",
    "nomor_struk": "BTR-20261004-0002",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "6d38a26d-43e7-5358-98af-f47637826b0c",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 204000,
    "diskon": 20400,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 183600,
    "metode_bayar": "tunai",
    "uang_diterima": 190000,
    "kembalian": 6400,
    "void_oleh": "2026-10-04T09:49:00+07:00",
    "alasan_void": "2026-10-04T09:49:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "a802244d-e524-5fc9-b53e-1fa3269a3704",
        "transaksi_id": "ebc65db9-350f-5284-b501-cf2fb978ed7e",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      },
      {
        "id": "3ec1d44d-d971-5cdf-9092-591ba00f0d02",
        "transaksi_id": "ebc65db9-350f-5284-b501-cf2fb978ed7e",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      },
      {
        "id": "1b521e88-82bd-53c7-9d63-59b20af44253",
        "transaksi_id": "ebc65db9-350f-5284-b501-cf2fb978ed7e",
        "produk_id": "2d5fb5b3-fa19-5c74-b13a-04cf2bc8234e",
        "nama_produk": "Kopi Susu Botol 1 L",
        "harga_satuan": 95000,
        "jumlah": 1,
        "subtotal": 95000
      }
    ]
  },
  {
    "id": "93bffec9-10ac-5f09-b2cb-e30957db90a3",
    "nomor_struk": "BTR-20261004-0003",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "6d38a26d-43e7-5358-98af-f47637826b0c",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 70000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 70000,
    "metode_bayar": "tunai",
    "uang_diterima": 100000,
    "kembalian": 30000,
    "void_oleh": "2026-10-04T11:07:00+07:00",
    "alasan_void": "2026-10-04T11:07:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "d261c7cb-006b-5460-a511-4fe35984a2e5",
        "transaksi_id": "93bffec9-10ac-5f09-b2cb-e30957db90a3",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      },
      {
        "id": "40d0d810-acc1-5751-8632-b38221b90f50",
        "transaksi_id": "93bffec9-10ac-5f09-b2cb-e30957db90a3",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      }
    ]
  },
  {
    "id": "d995469f-c980-5d46-b7ca-c78419f9d446",
    "nomor_struk": "BTR-20261006-0001",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "290c5e3b-e916-54f9-9ee6-17f5fa83ab13",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 80000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 80000,
    "metode_bayar": "tunai",
    "uang_diterima": 100000,
    "kembalian": 20000,
    "void_oleh": "2026-10-06T08:59:00+07:00",
    "alasan_void": "2026-10-06T08:59:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "7483fd5c-6388-591c-b303-20844e80db1c",
        "transaksi_id": "d995469f-c980-5d46-b7ca-c78419f9d446",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 2,
        "subtotal": 36000
      },
      {
        "id": "f92b29ca-fe6d-5308-8c3a-694eb8350432",
        "transaksi_id": "d995469f-c980-5d46-b7ca-c78419f9d446",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      }
    ]
  },
  {
    "id": "d7d9b457-18a6-5017-88e9-202e41aab08a",
    "nomor_struk": "BTR-20261006-0002",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "290c5e3b-e916-54f9-9ee6-17f5fa83ab13",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "void",
    "subtotal": 89000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 89000,
    "metode_bayar": "tunai",
    "uang_diterima": 100000,
    "kembalian": 11000,
    "void_oleh": "2026-10-06T10:34:00+07:00",
    "alasan_void": "2026-10-06T10:34:40+07:00",
    "void_pada": "2026-10-06T10:40:00+07:00",
    "dibuat_pada": "Salah input produk, pelanggan minta ganti menu",
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "5b7bf8fb-33fd-584a-b623-51377db9945c",
        "transaksi_id": "d7d9b457-18a6-5017-88e9-202e41aab08a",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      },
      {
        "id": "3a217ecc-d10a-5c86-8c1a-0f30cf6e407f",
        "transaksi_id": "d7d9b457-18a6-5017-88e9-202e41aab08a",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      },
      {
        "id": "776733f4-3b56-5596-8786-2979fbd7bac6",
        "transaksi_id": "d7d9b457-18a6-5017-88e9-202e41aab08a",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      }
    ]
  },
  {
    "id": "3cbf745d-b656-5e2f-a0fb-5225edd37723",
    "nomor_struk": "BTR-20261008-0001",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "20931a02-4e4d-51dc-bab3-a7af55e58782",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 74000,
    "diskon": 5000,
    "alasan_diskon": "Bawa tumbler sendiri",
    "total": 69000,
    "metode_bayar": "qris",
    "uang_diterima": 69000,
    "kembalian": 0,
    "void_oleh": "2026-10-08T08:49:00+07:00",
    "alasan_void": "2026-10-08T08:49:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "c5e00770-2b52-551b-9ff8-d59cc6730951",
        "transaksi_id": "3cbf745d-b656-5e2f-a0fb-5225edd37723",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 1,
        "subtotal": 30000
      },
      {
        "id": "03124311-f3d5-52a3-bfca-1f0b971ca005",
        "transaksi_id": "3cbf745d-b656-5e2f-a0fb-5225edd37723",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      }
    ]
  },
  {
    "id": "34d63fac-054d-536b-ade5-263dea413e51",
    "nomor_struk": "BTR-20261008-0002",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "20931a02-4e4d-51dc-bab3-a7af55e58782",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 28000,
    "diskon": 2800,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 25200,
    "metode_bayar": "tunai",
    "uang_diterima": 30000,
    "kembalian": 4800,
    "void_oleh": "2026-10-08T09:40:00+07:00",
    "alasan_void": "2026-10-08T09:40:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "b40eada2-0b0e-5eb0-b3da-443cb21afea5",
        "transaksi_id": "34d63fac-054d-536b-ade5-263dea413e51",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      }
    ]
  },
  {
    "id": "9f639db3-dfa1-567b-aa07-5184528d6799",
    "nomor_struk": "BTR-20261008-0003",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "20931a02-4e4d-51dc-bab3-a7af55e58782",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 28000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 28000,
    "metode_bayar": "tunai",
    "uang_diterima": 50000,
    "kembalian": 22000,
    "void_oleh": "2026-10-08T11:16:00+07:00",
    "alasan_void": "2026-10-08T11:16:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "911fd582-f25a-577b-bb78-b57e6f864843",
        "transaksi_id": "9f639db3-dfa1-567b-aa07-5184528d6799",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      }
    ]
  },
  {
    "id": "5e9878f8-d61c-5635-a83c-19c24c5a10fc",
    "nomor_struk": "BTR-20261010-0001",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "5ddc7c8f-74c3-520c-8d1a-513853d1042e",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 79000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 79000,
    "metode_bayar": "qris",
    "uang_diterima": 79000,
    "kembalian": 0,
    "void_oleh": "2026-10-10T09:21:00+07:00",
    "alasan_void": "2026-10-10T09:21:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "3c058150-fa26-5ed1-8235-ece8c51663e5",
        "transaksi_id": "5e9878f8-d61c-5635-a83c-19c24c5a10fc",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      },
      {
        "id": "96de596c-c19d-52e8-80af-e21ef504f3ff",
        "transaksi_id": "5e9878f8-d61c-5635-a83c-19c24c5a10fc",
        "produk_id": "f26530f3-0a9b-5b26-9136-750b5a5f55c0",
        "nama_produk": "Donat Gula Halus",
        "harga_satuan": 10000,
        "jumlah": 1,
        "subtotal": 10000
      },
      {
        "id": "88ceaac2-dee6-5c8d-aaa2-91cea5a40752",
        "transaksi_id": "5e9878f8-d61c-5635-a83c-19c24c5a10fc",
        "produk_id": "e492a9b2-879d-503d-89bc-2b2d47be0ab4",
        "nama_produk": "Banana Cake Slice",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      }
    ]
  },
  {
    "id": "612b6bc2-c6e3-5365-b0c9-7cd6ee092bf3",
    "nomor_struk": "BTR-20261010-0002",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "5ddc7c8f-74c3-520c-8d1a-513853d1042e",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 171000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 171000,
    "metode_bayar": "qris",
    "uang_diterima": 171000,
    "kembalian": 0,
    "void_oleh": "2026-10-10T10:58:00+07:00",
    "alasan_void": "2026-10-10T10:58:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "56f16014-064e-5ea9-8092-11cbd1f11ef5",
        "transaksi_id": "612b6bc2-c6e3-5365-b0c9-7cd6ee092bf3",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 1,
        "subtotal": 30000
      },
      {
        "id": "45ce5616-c8f7-5a10-beb6-5fdbd4d4c7de",
        "transaksi_id": "612b6bc2-c6e3-5365-b0c9-7cd6ee092bf3",
        "produk_id": "2b967038-d218-54c7-9c5f-26a893e01f11",
        "nama_produk": "Cookies Oat Madu (isi 6)",
        "harga_satuan": 35000,
        "jumlah": 1,
        "subtotal": 35000
      },
      {
        "id": "640c0ccd-0bd1-5cc1-a899-3542aa2de1a3",
        "transaksi_id": "612b6bc2-c6e3-5365-b0c9-7cd6ee092bf3",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "78783da8-ec0f-53db-affd-0903308db2af",
        "transaksi_id": "612b6bc2-c6e3-5365-b0c9-7cd6ee092bf3",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      }
    ]
  },
  {
    "id": "2f72f5af-bb60-5e06-978c-9e256f8b5f27",
    "nomor_struk": "BTR-20261010-0003",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "5ddc7c8f-74c3-520c-8d1a-513853d1042e",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 204000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 204000,
    "metode_bayar": "tunai",
    "uang_diterima": 210000,
    "kembalian": 6000,
    "void_oleh": "2026-10-10T12:33:00+07:00",
    "alasan_void": "2026-10-10T12:33:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "b671a60f-ea14-598a-9135-6e582c31a4c3",
        "transaksi_id": "2f72f5af-bb60-5e06-978c-9e256f8b5f27",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      },
      {
        "id": "208c1082-1c9e-57bc-ae75-333b69789b52",
        "transaksi_id": "2f72f5af-bb60-5e06-978c-9e256f8b5f27",
        "produk_id": "ff9dd343-b627-5a17-a177-1a1d23e3439d",
        "nama_produk": "Espresso",
        "harga_satuan": 18000,
        "jumlah": 1,
        "subtotal": 18000
      },
      {
        "id": "1afda406-d03d-5d45-b548-76a6eb3e97a8",
        "transaksi_id": "2f72f5af-bb60-5e06-978c-9e256f8b5f27",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 3,
        "subtotal": 75000
      },
      {
        "id": "e4ee6810-1f62-5f14-93a1-bb03077fe875",
        "transaksi_id": "2f72f5af-bb60-5e06-978c-9e256f8b5f27",
        "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
        "nama_produk": "Cokelat Panas",
        "harga_satuan": 27000,
        "jumlah": 1,
        "subtotal": 27000
      }
    ]
  },
  {
    "id": "b3215526-6472-5ec6-8074-efb28633eeb6",
    "nomor_struk": "BTR-20261012-0001",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "24578a8a-8304-5361-af22-00b2aa814772",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 94000,
    "diskon": 9400,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 84600,
    "metode_bayar": "qris",
    "uang_diterima": 84600,
    "kembalian": 0,
    "void_oleh": "2026-10-12T08:34:00+07:00",
    "alasan_void": "2026-10-12T08:34:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "754d6dfe-a600-5d2a-9c1e-b1908078a85a",
        "transaksi_id": "b3215526-6472-5ec6-8074-efb28633eeb6",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 3,
        "subtotal": 54000
      },
      {
        "id": "e1a6ead3-c9ae-5962-af78-357cea2f4128",
        "transaksi_id": "b3215526-6472-5ec6-8074-efb28633eeb6",
        "produk_id": "f26530f3-0a9b-5b26-9136-750b5a5f55c0",
        "nama_produk": "Donat Gula Halus",
        "harga_satuan": 10000,
        "jumlah": 2,
        "subtotal": 20000
      },
      {
        "id": "81c39b36-73f1-52b3-9cad-3842b822b4ba",
        "transaksi_id": "b3215526-6472-5ec6-8074-efb28633eeb6",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      }
    ]
  },
  {
    "id": "de46fcdf-8a4f-53c7-9c91-c5bcc642b737",
    "nomor_struk": "BTR-20261012-0002",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "24578a8a-8304-5361-af22-00b2aa814772",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 164000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 164000,
    "metode_bayar": "qris",
    "uang_diterima": 164000,
    "kembalian": 0,
    "void_oleh": "2026-10-12T10:29:00+07:00",
    "alasan_void": "2026-10-12T10:29:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "5256d263-994d-588d-b148-b4c48ba7c134",
        "transaksi_id": "de46fcdf-8a4f-53c7-9c91-c5bcc642b737",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "a6079f3c-01b6-5f2e-bc55-5093612d675b",
        "transaksi_id": "de46fcdf-8a4f-53c7-9c91-c5bcc642b737",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      },
      {
        "id": "fa07b4a9-83b3-5a42-af40-545c6906e884",
        "transaksi_id": "de46fcdf-8a4f-53c7-9c91-c5bcc642b737",
        "produk_id": "f26530f3-0a9b-5b26-9136-750b5a5f55c0",
        "nama_produk": "Donat Gula Halus",
        "harga_satuan": 10000,
        "jumlah": 3,
        "subtotal": 30000
      }
    ]
  },
  {
    "id": "621b8403-b5fc-513f-b9c2-884db43a549f",
    "nomor_struk": "BTR-20261012-0003",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "24578a8a-8304-5361-af22-00b2aa814772",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 81000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 81000,
    "metode_bayar": "qris",
    "uang_diterima": 81000,
    "kembalian": 0,
    "void_oleh": "2026-10-12T11:31:00+07:00",
    "alasan_void": "2026-10-12T11:31:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "4402c7ea-b2f5-50fd-bbba-540582706948",
        "transaksi_id": "621b8403-b5fc-513f-b9c2-884db43a549f",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "fdc056dc-e254-5fcd-8255-3ed799c65acd",
        "transaksi_id": "621b8403-b5fc-513f-b9c2-884db43a549f",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      }
    ]
  },
  {
    "id": "670a026a-0030-5bc7-86c4-7c4abcd309bc",
    "nomor_struk": "BTR-20261014-0001",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "ed24833b-450c-52a5-be80-f5e6d5a951c8",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 60000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 60000,
    "metode_bayar": "qris",
    "uang_diterima": 60000,
    "kembalian": 0,
    "void_oleh": "2026-10-14T08:17:00+07:00",
    "alasan_void": "2026-10-14T08:17:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "b8d6a038-53b5-5d5b-a574-67ccbe26ab70",
        "transaksi_id": "670a026a-0030-5bc7-86c4-7c4abcd309bc",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 3,
        "subtotal": 60000
      }
    ]
  },
  {
    "id": "24a5f4af-e474-54a4-9663-aff039db534b",
    "nomor_struk": "BTR-20261014-0002",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "ed24833b-450c-52a5-be80-f5e6d5a951c8",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 160000,
    "diskon": 16000,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 144000,
    "metode_bayar": "tunai",
    "uang_diterima": 150000,
    "kembalian": 6000,
    "void_oleh": "2026-10-14T09:13:00+07:00",
    "alasan_void": "2026-10-14T09:13:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "87395bd3-3859-59f5-a7a7-825b678854b9",
        "transaksi_id": "24a5f4af-e474-54a4-9663-aff039db534b",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      },
      {
        "id": "0131345b-4e8e-5cf4-8d6c-dceb63fd34de",
        "transaksi_id": "24a5f4af-e474-54a4-9663-aff039db534b",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 2,
        "subtotal": 48000
      },
      {
        "id": "e2205b89-bf15-5dd8-9d2b-1fa1975689db",
        "transaksi_id": "24a5f4af-e474-54a4-9663-aff039db534b",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "cdf29d9e-8aae-5604-a7c8-c692b0c16e6c",
        "transaksi_id": "24a5f4af-e474-54a4-9663-aff039db534b",
        "produk_id": "ff9dd343-b627-5a17-a177-1a1d23e3439d",
        "nama_produk": "Espresso",
        "harga_satuan": 18000,
        "jumlah": 1,
        "subtotal": 18000
      }
    ]
  },
  {
    "id": "ce31aa55-c236-520d-8084-1f2b905cdc82",
    "nomor_struk": "BTR-20261014-0003",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "shift_id": "ed24833b-450c-52a5-be80-f5e6d5a951c8",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "lunas",
    "subtotal": 45000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 45000,
    "metode_bayar": "tunai",
    "uang_diterima": 50000,
    "kembalian": 5000,
    "void_oleh": "2026-10-14T09:52:00+07:00",
    "alasan_void": "2026-10-14T09:52:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    },
    "items": [
      {
        "id": "50c9a776-ad95-5b25-96df-7fbe98278e73",
        "transaksi_id": "ce31aa55-c236-520d-8084-1f2b905cdc82",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      },
      {
        "id": "656ad5c2-0509-5561-8c43-9ad1f963068a",
        "transaksi_id": "ce31aa55-c236-520d-8084-1f2b905cdc82",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      }
    ]
  },
  {
    "id": "8def7772-cbb4-5626-8043-f73bd784d339",
    "nomor_struk": "DPK-20261001-0001",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "c53a5c16-1315-5d26-88af-7401d546f3b0",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 124000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 124000,
    "metode_bayar": "qris",
    "uang_diterima": 124000,
    "kembalian": 0,
    "void_oleh": "2026-10-01T08:21:00+07:00",
    "alasan_void": "2026-10-01T08:21:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "f8e72d8d-7b36-5d27-9920-82a2e24c79f6",
        "transaksi_id": "8def7772-cbb4-5626-8043-f73bd784d339",
        "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
        "nama_produk": "Cokelat Panas",
        "harga_satuan": 27000,
        "jumlah": 1,
        "subtotal": 27000
      },
      {
        "id": "c2322005-b4ce-5c07-9d5c-cd21a157cf07",
        "transaksi_id": "8def7772-cbb4-5626-8043-f73bd784d339",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      },
      {
        "id": "e4b7bb89-a21e-5a57-b8fc-6da346af4c34",
        "transaksi_id": "8def7772-cbb4-5626-8043-f73bd784d339",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 2,
        "subtotal": 44000
      },
      {
        "id": "bf149723-addd-5c15-9b0c-3158d0ad35f7",
        "transaksi_id": "8def7772-cbb4-5626-8043-f73bd784d339",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      }
    ]
  },
  {
    "id": "629fe84a-5431-5bc8-97c1-497aeb041db3",
    "nomor_struk": "DPK-20261001-0002",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "c53a5c16-1315-5d26-88af-7401d546f3b0",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 38000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 38000,
    "metode_bayar": "tunai",
    "uang_diterima": 50000,
    "kembalian": 12000,
    "void_oleh": "2026-10-01T09:00:00+07:00",
    "alasan_void": "2026-10-01T09:00:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "9d35f532-1357-5de7-a444-13723f343b01",
        "transaksi_id": "629fe84a-5431-5bc8-97c1-497aeb041db3",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "51605b57-6d12-5145-b4d0-b16cef79f98f",
        "transaksi_id": "629fe84a-5431-5bc8-97c1-497aeb041db3",
        "produk_id": "f26530f3-0a9b-5b26-9136-750b5a5f55c0",
        "nama_produk": "Donat Gula Halus",
        "harga_satuan": 10000,
        "jumlah": 1,
        "subtotal": 10000
      }
    ]
  },
  {
    "id": "6114f431-9b76-56f2-aaac-6e635cc0aaeb",
    "nomor_struk": "DPK-20261001-0003",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "c53a5c16-1315-5d26-88af-7401d546f3b0",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 48000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 48000,
    "metode_bayar": "qris",
    "uang_diterima": 48000,
    "kembalian": 0,
    "void_oleh": "2026-10-01T09:56:00+07:00",
    "alasan_void": "2026-10-01T09:56:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "085c922e-6c2f-557b-bad3-f94aafb38fae",
        "transaksi_id": "6114f431-9b76-56f2-aaac-6e635cc0aaeb",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 2,
        "subtotal": 48000
      }
    ]
  },
  {
    "id": "586f16c6-6b96-56df-a921-de6cbd6d5736",
    "nomor_struk": "DPK-20261004-0001",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "b8dd1283-2e27-53fd-be52-8442ef2020e5",
    "kasir_id": "a9200124-867d-5c01-8275-180c01f96a80",
    "status": "lunas",
    "subtotal": 47000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 47000,
    "metode_bayar": "qris",
    "uang_diterima": 47000,
    "kembalian": 0,
    "void_oleh": "2026-10-04T09:15:00+07:00",
    "alasan_void": "2026-10-04T09:15:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "a9200124-867d-5c01-8275-180c01f96a80",
      "nama_lengkap": "Rizky Ramadhan",
      "email": "rizky.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": false
    },
    "items": [
      {
        "id": "d5936ac6-cfd0-5a57-8288-5179ee76b47d",
        "transaksi_id": "586f16c6-6b96-56df-a921-de6cbd6d5736",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 1,
        "subtotal": 22000
      },
      {
        "id": "cfbc6648-bf53-5dca-87d9-489a307a46a6",
        "transaksi_id": "586f16c6-6b96-56df-a921-de6cbd6d5736",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      }
    ]
  },
  {
    "id": "9dc5f656-e8be-5ef7-b977-c121b067f489",
    "nomor_struk": "DPK-20261004-0002",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "b8dd1283-2e27-53fd-be52-8442ef2020e5",
    "kasir_id": "a9200124-867d-5c01-8275-180c01f96a80",
    "status": "lunas",
    "subtotal": 170000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 170000,
    "metode_bayar": "tunai",
    "uang_diterima": 200000,
    "kembalian": 30000,
    "void_oleh": "2026-10-04T09:50:00+07:00",
    "alasan_void": "2026-10-04T09:50:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "a9200124-867d-5c01-8275-180c01f96a80",
      "nama_lengkap": "Rizky Ramadhan",
      "email": "rizky.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": false
    },
    "items": [
      {
        "id": "eade7205-8948-5922-83c8-eacefc5e55ab",
        "transaksi_id": "9dc5f656-e8be-5ef7-b977-c121b067f489",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 2,
        "subtotal": 40000
      },
      {
        "id": "ed8bf888-442b-5a20-b80a-bd9a55179006",
        "transaksi_id": "9dc5f656-e8be-5ef7-b977-c121b067f489",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "d838fb36-cac6-5589-aaf2-610c92f2ef09",
        "transaksi_id": "9dc5f656-e8be-5ef7-b977-c121b067f489",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 2,
        "subtotal": 48000
      },
      {
        "id": "ee95f82c-762c-5006-9dd4-a1983e056e66",
        "transaksi_id": "9dc5f656-e8be-5ef7-b977-c121b067f489",
        "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
        "nama_produk": "Cokelat Panas",
        "harga_satuan": 27000,
        "jumlah": 2,
        "subtotal": 54000
      }
    ]
  },
  {
    "id": "617c2f9b-ea75-53bf-bc9e-943f07a5a79b",
    "nomor_struk": "DPK-20261006-0001",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "5677b4f7-8de8-5363-9fbe-50ca9f7c1a97",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 130000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 130000,
    "metode_bayar": "tunai",
    "uang_diterima": 130000,
    "kembalian": 0,
    "void_oleh": "2026-10-06T08:27:00+07:00",
    "alasan_void": "2026-10-06T08:27:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "cd725318-688c-51c3-a9e8-7713f5b99566",
        "transaksi_id": "617c2f9b-ea75-53bf-bc9e-943f07a5a79b",
        "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
        "nama_produk": "Croissant Mentega",
        "harga_satuan": 24000,
        "jumlah": 1,
        "subtotal": 24000
      },
      {
        "id": "c48b8770-b820-5f76-967d-e6b4396494d2",
        "transaksi_id": "617c2f9b-ea75-53bf-bc9e-943f07a5a79b",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "de5bbed2-fa4a-5ca1-8855-6e49e55a41ef",
        "transaksi_id": "617c2f9b-ea75-53bf-bc9e-943f07a5a79b",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "5f6a6d83-bfa5-5ea5-bd6d-4029e2ad6de9",
        "transaksi_id": "617c2f9b-ea75-53bf-bc9e-943f07a5a79b",
        "produk_id": "e492a9b2-879d-503d-89bc-2b2d47be0ab4",
        "nama_produk": "Banana Cake Slice",
        "harga_satuan": 22000,
        "jumlah": 1,
        "subtotal": 22000
      }
    ]
  },
  {
    "id": "5d4c7ccd-3048-5e7d-9a44-00f180c8b80e",
    "nomor_struk": "DPK-20261006-0002",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "5677b4f7-8de8-5363-9fbe-50ca9f7c1a97",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 124000,
    "diskon": 12400,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 111600,
    "metode_bayar": "qris",
    "uang_diterima": 111600,
    "kembalian": 0,
    "void_oleh": "2026-10-06T09:37:00+07:00",
    "alasan_void": "2026-10-06T09:37:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "55067e68-93dc-57aa-bf46-487b321bf34c",
        "transaksi_id": "5d4c7ccd-3048-5e7d-9a44-00f180c8b80e",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "7cbc328c-fb66-572a-863c-fedd38d4e68d",
        "transaksi_id": "5d4c7ccd-3048-5e7d-9a44-00f180c8b80e",
        "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
        "nama_produk": "Teh Tarik",
        "harga_satuan": 20000,
        "jumlah": 1,
        "subtotal": 20000
      },
      {
        "id": "9719c68f-e5b0-5c2c-99c2-0eca8dccc1fd",
        "transaksi_id": "5d4c7ccd-3048-5e7d-9a44-00f180c8b80e",
        "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
        "nama_produk": "Cokelat Panas",
        "harga_satuan": 27000,
        "jumlah": 2,
        "subtotal": 54000
      }
    ]
  },
  {
    "id": "073a2b42-aa41-5a73-8983-661b8ca3212e",
    "nomor_struk": "DPK-20261009-0001",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "85a50bef-24a6-59df-9617-afb4761e20dd",
    "kasir_id": "a9200124-867d-5c01-8275-180c01f96a80",
    "status": "lunas",
    "subtotal": 138000,
    "diskon": 13800,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 124200,
    "metode_bayar": "qris",
    "uang_diterima": 124200,
    "kembalian": 0,
    "void_oleh": "2026-10-09T08:59:00+07:00",
    "alasan_void": "2026-10-09T08:59:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "a9200124-867d-5c01-8275-180c01f96a80",
      "nama_lengkap": "Rizky Ramadhan",
      "email": "rizky.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": false
    },
    "items": [
      {
        "id": "918c4587-6666-54e2-8729-bb4437bb5262",
        "transaksi_id": "073a2b42-aa41-5a73-8983-661b8ca3212e",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 2,
        "subtotal": 36000
      },
      {
        "id": "9a58de89-9315-5dcd-9953-69ff1b7e5429",
        "transaksi_id": "073a2b42-aa41-5a73-8983-661b8ca3212e",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 3,
        "subtotal": 75000
      },
      {
        "id": "a644afa6-92a3-52fc-b316-db074d245c30",
        "transaksi_id": "073a2b42-aa41-5a73-8983-661b8ca3212e",
        "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
        "nama_produk": "Cokelat Panas",
        "harga_satuan": 27000,
        "jumlah": 1,
        "subtotal": 27000
      }
    ]
  },
  {
    "id": "5ad3cd89-3537-5d77-a25d-16b8308f2e3b",
    "nomor_struk": "DPK-20261009-0002",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "85a50bef-24a6-59df-9617-afb4761e20dd",
    "kasir_id": "a9200124-867d-5c01-8275-180c01f96a80",
    "status": "lunas",
    "subtotal": 160000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 160000,
    "metode_bayar": "tunai",
    "uang_diterima": 160000,
    "kembalian": 0,
    "void_oleh": "2026-10-09T09:56:00+07:00",
    "alasan_void": "2026-10-09T09:56:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "a9200124-867d-5c01-8275-180c01f96a80",
      "nama_lengkap": "Rizky Ramadhan",
      "email": "rizky.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": false
    },
    "items": [
      {
        "id": "d67a3920-6912-568e-9fb3-33991a3d9694",
        "transaksi_id": "5ad3cd89-3537-5d77-a25d-16b8308f2e3b",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "38a66cc8-721d-58f0-835e-13e929bb8551",
        "transaksi_id": "5ad3cd89-3537-5d77-a25d-16b8308f2e3b",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 1,
        "subtotal": 18000
      },
      {
        "id": "53bb52c9-a864-5b81-9292-d1d4105d35ad",
        "transaksi_id": "5ad3cd89-3537-5d77-a25d-16b8308f2e3b",
        "produk_id": "e492a9b2-879d-503d-89bc-2b2d47be0ab4",
        "nama_produk": "Banana Cake Slice",
        "harga_satuan": 22000,
        "jumlah": 1,
        "subtotal": 22000
      },
      {
        "id": "bb02f896-05fd-592e-8bbb-0de283beccf0",
        "transaksi_id": "5ad3cd89-3537-5d77-a25d-16b8308f2e3b",
        "produk_id": "a782db86-9f4c-5c12-a981-8b4dd14205e0",
        "nama_produk": "Roti Sobek Keju",
        "harga_satuan": 32000,
        "jumlah": 2,
        "subtotal": 64000
      }
    ]
  },
  {
    "id": "3f53f3df-3d78-5c4c-8a07-0fb8beaece90",
    "nomor_struk": "DPK-20261009-0003",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "85a50bef-24a6-59df-9617-afb4761e20dd",
    "kasir_id": "a9200124-867d-5c01-8275-180c01f96a80",
    "status": "lunas",
    "subtotal": 72000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 72000,
    "metode_bayar": "tunai",
    "uang_diterima": 80000,
    "kembalian": 8000,
    "void_oleh": "2026-10-09T10:41:00+07:00",
    "alasan_void": "2026-10-09T10:41:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "a9200124-867d-5c01-8275-180c01f96a80",
      "nama_lengkap": "Rizky Ramadhan",
      "email": "rizky.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": false
    },
    "items": [
      {
        "id": "5151b6cb-464d-5b18-bb90-e16e9ab9f8b8",
        "transaksi_id": "3f53f3df-3d78-5c4c-8a07-0fb8beaece90",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 1,
        "subtotal": 18000
      },
      {
        "id": "17ea67f6-1c5d-51e4-ad2d-16e74ca93772",
        "transaksi_id": "3f53f3df-3d78-5c4c-8a07-0fb8beaece90",
        "produk_id": "ff9dd343-b627-5a17-a177-1a1d23e3439d",
        "nama_produk": "Espresso",
        "harga_satuan": 18000,
        "jumlah": 3,
        "subtotal": 54000
      }
    ]
  },
  {
    "id": "33fed697-b95c-5f79-876f-609b5414fb24",
    "nomor_struk": "DPK-20261011-0001",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "223bd652-7599-562a-8584-e6a3721de931",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 180000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 180000,
    "metode_bayar": "qris",
    "uang_diterima": 180000,
    "kembalian": 0,
    "void_oleh": "2026-10-11T08:02:00+07:00",
    "alasan_void": "2026-10-11T08:02:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "488cbb1b-da54-5514-a4ad-bf3faf87fcf1",
        "transaksi_id": "33fed697-b95c-5f79-876f-609b5414fb24",
        "produk_id": "2d5fb5b3-fa19-5c74-b13a-04cf2bc8234e",
        "nama_produk": "Kopi Susu Botol 1 L",
        "harga_satuan": 95000,
        "jumlah": 1,
        "subtotal": 95000
      },
      {
        "id": "8f69cd06-bbbc-5277-9e89-574aea4ffce1",
        "transaksi_id": "33fed697-b95c-5f79-876f-609b5414fb24",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 1,
        "subtotal": 25000
      },
      {
        "id": "b48b0eef-3002-5d89-bb37-785206eae455",
        "transaksi_id": "33fed697-b95c-5f79-876f-609b5414fb24",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 2,
        "subtotal": 60000
      }
    ]
  },
  {
    "id": "65cb2c9d-49f2-5874-83cf-735705d8d481",
    "nomor_struk": "DPK-20261011-0002",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "223bd652-7599-562a-8584-e6a3721de931",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 160000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 160000,
    "metode_bayar": "qris",
    "uang_diterima": 160000,
    "kembalian": 0,
    "void_oleh": "2026-10-11T09:50:00+07:00",
    "alasan_void": "2026-10-11T09:50:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "9adcf801-56f3-5bad-a9cc-952c053c52dc",
        "transaksi_id": "65cb2c9d-49f2-5874-83cf-735705d8d481",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 1,
        "subtotal": 18000
      },
      {
        "id": "4a73eaf0-e945-56ce-b112-e5c3deb78a49",
        "transaksi_id": "65cb2c9d-49f2-5874-83cf-735705d8d481",
        "produk_id": "2b967038-d218-54c7-9c5f-26a893e01f11",
        "nama_produk": "Cookies Oat Madu (isi 6)",
        "harga_satuan": 35000,
        "jumlah": 2,
        "subtotal": 70000
      },
      {
        "id": "bced0c1d-2ecc-5299-a986-9b4e4bf6a467",
        "transaksi_id": "65cb2c9d-49f2-5874-83cf-735705d8d481",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 1,
        "subtotal": 22000
      },
      {
        "id": "c55ff336-893e-5f26-b1cb-35edb16db072",
        "transaksi_id": "65cb2c9d-49f2-5874-83cf-735705d8d481",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      }
    ]
  },
  {
    "id": "f0d9f86e-4261-59b2-9cc3-a270187a95d2",
    "nomor_struk": "DPK-20261011-0003",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "223bd652-7599-562a-8584-e6a3721de931",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 50000,
    "diskon": 5000,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 45000,
    "metode_bayar": "qris",
    "uang_diterima": 45000,
    "kembalian": 0,
    "void_oleh": "2026-10-11T10:53:00+07:00",
    "alasan_void": "2026-10-11T10:53:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "964c2301-4579-5ff9-a651-274607d4370f",
        "transaksi_id": "f0d9f86e-4261-59b2-9cc3-a270187a95d2",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      }
    ]
  },
  {
    "id": "d6b48dd5-c811-5fbd-9d0d-9ab4239dac1e",
    "nomor_struk": "DPK-20261013-0001",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "977abe18-7426-5c38-8348-474cd5fe7d6a",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 276000,
    "diskon": 5000,
    "alasan_diskon": "Bawa tumbler sendiri",
    "total": 271000,
    "metode_bayar": "tunai",
    "uang_diterima": 280000,
    "kembalian": 9000,
    "void_oleh": "2026-10-13T08:29:00+07:00",
    "alasan_void": "2026-10-13T08:29:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "0f177969-4760-5f88-a61d-b9006c6cdb3f",
        "transaksi_id": "d6b48dd5-c811-5fbd-9d0d-9ab4239dac1e",
        "produk_id": "e492a9b2-879d-503d-89bc-2b2d47be0ab4",
        "nama_produk": "Banana Cake Slice",
        "harga_satuan": 22000,
        "jumlah": 3,
        "subtotal": 66000
      },
      {
        "id": "0814afe7-1db4-5e69-b795-e2470220dd59",
        "transaksi_id": "d6b48dd5-c811-5fbd-9d0d-9ab4239dac1e",
        "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
        "nama_produk": "Cokelat Panas",
        "harga_satuan": 27000,
        "jumlah": 2,
        "subtotal": 54000
      },
      {
        "id": "5252e148-4a71-5b20-a619-61894f88943c",
        "transaksi_id": "d6b48dd5-c811-5fbd-9d0d-9ab4239dac1e",
        "produk_id": "9656c367-b523-52c0-b46d-5eabbdac5c99",
        "nama_produk": "Tumbler Lumbung 450 ml",
        "harga_satuan": 120000,
        "jumlah": 1,
        "subtotal": 120000
      },
      {
        "id": "442cb845-f47b-574b-a59c-1d692366d5b5",
        "transaksi_id": "d6b48dd5-c811-5fbd-9d0d-9ab4239dac1e",
        "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
        "nama_produk": "Roti Pisang Cokelat",
        "harga_satuan": 18000,
        "jumlah": 2,
        "subtotal": 36000
      }
    ]
  },
  {
    "id": "da44649b-dfb6-5128-9d09-a89cba2f184f",
    "nomor_struk": "DPK-20261013-0002",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "977abe18-7426-5c38-8348-474cd5fe7d6a",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 257000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 257000,
    "metode_bayar": "tunai",
    "uang_diterima": 500000,
    "kembalian": 243000,
    "void_oleh": "2026-10-13T09:28:00+07:00",
    "alasan_void": "2026-10-13T09:28:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "241872d3-c01d-5f76-bf3d-516149d6a0bb",
        "transaksi_id": "da44649b-dfb6-5128-9d09-a89cba2f184f",
        "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
        "nama_produk": "Americano",
        "harga_satuan": 22000,
        "jumlah": 3,
        "subtotal": 66000
      },
      {
        "id": "426e0436-3849-5abe-aa45-1fe52b33ef6e",
        "transaksi_id": "da44649b-dfb6-5128-9d09-a89cba2f184f",
        "produk_id": "71c22606-2702-558e-b464-92af2dca8071",
        "nama_produk": "Biji Kopi Lumbung 250 g",
        "harga_satuan": 85000,
        "jumlah": 1,
        "subtotal": 85000
      },
      {
        "id": "abbb2ff8-6561-5d52-9672-7d9e6b7570f3",
        "transaksi_id": "da44649b-dfb6-5128-9d09-a89cba2f184f",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "049c7893-781e-5890-8c76-bc5942d1f4ad",
        "transaksi_id": "da44649b-dfb6-5128-9d09-a89cba2f184f",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      }
    ]
  },
  {
    "id": "13de85a7-c2fc-5a74-bb7a-c14cc879fd97",
    "nomor_struk": "DPK-20261014-0001",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "5b6aeaf2-53a1-5863-8118-8c3df986d4a1",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 156000,
    "diskon": 0,
    "alasan_diskon": null,
    "total": 156000,
    "metode_bayar": "qris",
    "uang_diterima": 156000,
    "kembalian": 0,
    "void_oleh": "2026-10-14T08:39:00+07:00",
    "alasan_void": "2026-10-14T08:39:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "a719a09c-2377-566c-b0f8-160935c1d271",
        "transaksi_id": "13de85a7-c2fc-5a74-bb7a-c14cc879fd97",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 2,
        "subtotal": 56000
      },
      {
        "id": "2e86669f-9924-52dc-bdb6-83d0d3d8c0ed",
        "transaksi_id": "13de85a7-c2fc-5a74-bb7a-c14cc879fd97",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "06628559-e275-52c2-bab3-033d55687c5e",
        "transaksi_id": "13de85a7-c2fc-5a74-bb7a-c14cc879fd97",
        "produk_id": "e492a9b2-879d-503d-89bc-2b2d47be0ab4",
        "nama_produk": "Banana Cake Slice",
        "harga_satuan": 22000,
        "jumlah": 1,
        "subtotal": 22000
      },
      {
        "id": "2ac8f6c3-97f3-562e-9520-ba2501740ba8",
        "transaksi_id": "13de85a7-c2fc-5a74-bb7a-c14cc879fd97",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      }
    ]
  },
  {
    "id": "0bfabfab-12e1-5c3a-b18a-4e754bcc0a11",
    "nomor_struk": "DPK-20261014-0002",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "5b6aeaf2-53a1-5863-8118-8c3df986d4a1",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 138000,
    "diskon": 5000,
    "alasan_diskon": "Bawa tumbler sendiri",
    "total": 133000,
    "metode_bayar": "tunai",
    "uang_diterima": 140000,
    "kembalian": 7000,
    "void_oleh": "2026-10-14T10:23:00+07:00",
    "alasan_void": "2026-10-14T10:23:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "24df7c0d-c4c9-5a9b-ae19-a542a6beb31e",
        "transaksi_id": "0bfabfab-12e1-5c3a-b18a-4e754bcc0a11",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "69540961-09ff-588f-b36b-33703e814431",
        "transaksi_id": "0bfabfab-12e1-5c3a-b18a-4e754bcc0a11",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 1,
        "subtotal": 28000
      },
      {
        "id": "2615a112-256a-5dfa-a688-91db5c0b0a8a",
        "transaksi_id": "0bfabfab-12e1-5c3a-b18a-4e754bcc0a11",
        "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
        "nama_produk": "Matcha Latte",
        "harga_satuan": 30000,
        "jumlah": 2,
        "subtotal": 60000
      }
    ]
  },
  {
    "id": "a6ddf041-7b8b-5a54-b36f-02b667987bd8",
    "nomor_struk": "DPK-20261014-0003",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "shift_id": "5b6aeaf2-53a1-5863-8118-8c3df986d4a1",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "lunas",
    "subtotal": 218000,
    "diskon": 21800,
    "alasan_diskon": "Promo member Lumbung 10%",
    "total": 196200,
    "metode_bayar": "qris",
    "uang_diterima": 196200,
    "kembalian": 0,
    "void_oleh": "2026-10-14T11:54:00+07:00",
    "alasan_void": "2026-10-14T11:54:40+07:00",
    "void_pada": null,
    "dibuat_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    },
    "items": [
      {
        "id": "1de67283-2e4a-5cbd-a1dd-5e3c3e847196",
        "transaksi_id": "a6ddf041-7b8b-5a54-b36f-02b667987bd8",
        "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
        "nama_produk": "Kopi Susu Lumbung",
        "harga_satuan": 25000,
        "jumlah": 2,
        "subtotal": 50000
      },
      {
        "id": "959eeb3e-a87b-56ad-b214-1808eee0e522",
        "transaksi_id": "a6ddf041-7b8b-5a54-b36f-02b667987bd8",
        "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
        "nama_produk": "Caffe Latte",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      },
      {
        "id": "0fb11dba-f434-589c-8588-ff0e8656e03d",
        "transaksi_id": "a6ddf041-7b8b-5a54-b36f-02b667987bd8",
        "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
        "nama_produk": "Cappuccino",
        "harga_satuan": 28000,
        "jumlah": 3,
        "subtotal": 84000
      }
    ]
  }
];

export const SEED_SHIFTS: ShiftKasir[] = [
  {
    "id": "9743fdd1-c665-5f65-b90e-640180638180",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-01T07:01:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-01T12:03:00+07:00",
    "total_tunai": 164000,
    "total_qris": 188100,
    "kas_seharusnya": 664000,
    "uang_fisik": 664000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "c48072ea-fa38-5079-beb2-39976a8e1101",
    "diverifikasi_pada": "2026-10-01T13:18:00+07:00",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "ad29fb45-0972-50b5-8ffa-1a99e2c614df",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-03T07:06:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-03T12:44:00+07:00",
    "total_tunai": 0,
    "total_qris": 240000,
    "kas_seharusnya": 500000,
    "uang_fisik": 500000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "c48072ea-fa38-5079-beb2-39976a8e1101",
    "diverifikasi_pada": "2026-10-03T13:59:00+07:00",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "2982fc29-e3c5-558a-82b5-ab2cb697b3d4",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-05T07:01:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-05T11:33:00+07:00",
    "total_tunai": 113000,
    "total_qris": 112000,
    "kas_seharusnya": 613000,
    "uang_fisik": 613000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "c48072ea-fa38-5079-beb2-39976a8e1101",
    "diverifikasi_pada": "2026-10-05T12:48:00+07:00",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "3b4b07cf-ae85-570a-a830-09660552ad2d",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-07T07:06:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-07T10:18:00+07:00",
    "total_tunai": 0,
    "total_qris": 171000,
    "kas_seharusnya": 500000,
    "uang_fisik": 495000,
    "selisih": -5000,
    "catatan_selisih": "Selisih kecil, uang receh",
    "diverifikasi_oleh": "c48072ea-fa38-5079-beb2-39976a8e1101",
    "diverifikasi_pada": "2026-10-07T11:33:00+07:00",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "0f0047ec-d203-5284-87e3-0f1263df9a0a",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-09T07:06:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-09T10:54:00+07:00",
    "total_tunai": 194000,
    "total_qris": 139000,
    "kas_seharusnya": 694000,
    "uang_fisik": 694000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "c48072ea-fa38-5079-beb2-39976a8e1101",
    "diverifikasi_pada": "2026-10-09T12:09:00+07:00",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "6d671e28-91fb-5278-8425-9262b0a26adb",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-11T07:00:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-11T11:59:00+07:00",
    "total_tunai": 146000,
    "total_qris": 79000,
    "kas_seharusnya": 646000,
    "uang_fisik": 646000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "c48072ea-fa38-5079-beb2-39976a8e1101",
    "diverifikasi_pada": "2026-10-11T13:14:00+07:00",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "4d403b88-4ef9-5c79-8f54-cdfccbb5fb90",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "ditutup",
    "dibuka_pada": "2026-10-13T07:07:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-13T12:21:00+07:00",
    "total_tunai": 138000,
    "total_qris": 206000,
    "kas_seharusnya": 638000,
    "uang_fisik": 638000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": null,
    "diverifikasi_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "cf72ee97-5064-5b23-b04b-713fb2626d7a",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
    "status": "ditutup",
    "dibuka_pada": "2026-10-14T07:06:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-14T11:31:00+07:00",
    "total_tunai": 184000,
    "total_qris": 151000,
    "kas_seharusnya": 684000,
    "uang_fisik": 684000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": null,
    "diverifikasi_pada": null,
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "eef1a1c7-67d3-5990-9eed-455d0d68119b",
      "nama_lengkap": "Putri Maharani",
      "email": "putri.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "abd84bfa-186b-5825-bfae-330b162e3877",
    "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
    "kasir_id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-15T07:02:00+07:00",
    "ditutup_pada": "2026-10-15T12:00:00+07:00",
    "kas_awal": 500000,
    "total_tunai": 146000,
    "total_qris": 238000,
    "kas_seharusnya": 646000,
    "uang_fisik": 646000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "c48072ea-fa38-5079-beb2-39976a8e1101",
    "diverifikasi_pada": "2026-10-15T13:00:00+07:00",
    "cabang": {
      "id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "kode": "TBT",
      "nama": "Lumbung Tebet",
      "alamat": "Jl. Tebet Raya No. 41, Jakarta Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "e3c3bf7f-d7d1-5b01-8ce3-8b731e0f2416",
      "nama_lengkap": "Dimas Arya",
      "email": "dimas.kasir.tebet@lumbung.test",
      "peran": "kasir",
      "cabang_id": "030cfd87-60a3-51b0-9cdf-c083b46a32cd",
      "aktif": true
    }
  },
  {
    "id": "2c1463a3-9cba-5e61-8e37-384bd763e0ce",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-02T07:01:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-02T10:45:00+07:00",
    "total_tunai": 437000,
    "total_qris": 217000,
    "kas_seharusnya": 937000,
    "uang_fisik": 937000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "b6359b88-3527-533a-8f45-0dedb61c6fe0",
    "diverifikasi_pada": "2026-10-02T12:00:00+07:00",
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    }
  },
  {
    "id": "6d38a26d-43e7-5358-98af-f47637826b0c",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-04T07:02:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-04T11:52:00+07:00",
    "total_tunai": 253600,
    "total_qris": 90000,
    "kas_seharusnya": 753600,
    "uang_fisik": 753600,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "b6359b88-3527-533a-8f45-0dedb61c6fe0",
    "diverifikasi_pada": "2026-10-04T13:07:00+07:00",
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    }
  },
  {
    "id": "290c5e3b-e916-54f9-9ee6-17f5fa83ab13",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-06T07:08:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-06T11:19:00+07:00",
    "total_tunai": 80000,
    "total_qris": 0,
    "kas_seharusnya": 580000,
    "uang_fisik": 580000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "b6359b88-3527-533a-8f45-0dedb61c6fe0",
    "diverifikasi_pada": "2026-10-06T12:34:00+07:00",
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    }
  },
  {
    "id": "20931a02-4e4d-51dc-bab3-a7af55e58782",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-08T07:10:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-08T12:01:00+07:00",
    "total_tunai": 53200,
    "total_qris": 69000,
    "kas_seharusnya": 553200,
    "uang_fisik": 553200,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "b6359b88-3527-533a-8f45-0dedb61c6fe0",
    "diverifikasi_pada": "2026-10-08T13:16:00+07:00",
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    }
  },
  {
    "id": "5ddc7c8f-74c3-520c-8d1a-513853d1042e",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-10T07:08:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-10T13:18:00+07:00",
    "total_tunai": 204000,
    "total_qris": 250000,
    "kas_seharusnya": 704000,
    "uang_fisik": 706000,
    "selisih": 2000,
    "catatan_selisih": "Selisih kecil, uang receh",
    "diverifikasi_oleh": "b6359b88-3527-533a-8f45-0dedb61c6fe0",
    "diverifikasi_pada": "2026-10-10T14:33:00+07:00",
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    }
  },
  {
    "id": "24578a8a-8304-5361-af22-00b2aa814772",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-12T07:08:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-12T12:16:00+07:00",
    "total_tunai": 0,
    "total_qris": 329600,
    "kas_seharusnya": 500000,
    "uang_fisik": 500000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "b6359b88-3527-533a-8f45-0dedb61c6fe0",
    "diverifikasi_pada": "2026-10-12T13:31:00+07:00",
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    }
  },
  {
    "id": "ed24833b-450c-52a5-be80-f5e6d5a951c8",
    "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
    "kasir_id": "1cbc1816-011a-53fb-97e0-3c886376068b",
    "status": "ditutup",
    "dibuka_pada": "2026-10-14T07:05:00+07:00",
    "ditutup_pada": "500000",
    "kas_awal": "2026-10-14T10:37:00+07:00",
    "total_tunai": 189000,
    "total_qris": 60000,
    "kas_seharusnya": 689000,
    "uang_fisik": 689000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": null,
    "diverifikasi_pada": null,
    "cabang": {
      "id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "kode": "BTR",
      "nama": "Lumbung Bintaro",
      "alamat": "Jl. Bintaro Utama 3 Blok B2, Tangerang Selatan",
      "aktif": true
    },
    "kasir": {
      "id": "1cbc1816-011a-53fb-97e0-3c886376068b",
      "nama_lengkap": "Fajar Nugroho",
      "email": "fajar.kasir.bintaro@lumbung.test",
      "peran": "kasir",
      "cabang_id": "5081871b-3bf3-50c3-b8f4-e5087f2996e2",
      "aktif": true
    }
  },
  {
    "id": "c53a5c16-1315-5d26-88af-7401d546f3b0",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-01T07:04:00+07:00",
    "ditutup_pada": "300000",
    "kas_awal": "2026-10-01T10:41:00+07:00",
    "total_tunai": 38000,
    "total_qris": 172000,
    "kas_seharusnya": 338000,
    "uang_fisik": 338000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "eaa6a6c2-8381-598f-8bce-6d90094c2239",
    "diverifikasi_pada": "2026-10-01T11:56:00+07:00",
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    }
  },
  {
    "id": "b8dd1283-2e27-53fd-be52-8442ef2020e5",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "kasir_id": "a9200124-867d-5c01-8275-180c01f96a80",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-04T07:07:00+07:00",
    "ditutup_pada": "300000",
    "kas_awal": "2026-10-04T10:35:00+07:00",
    "total_tunai": 170000,
    "total_qris": 47000,
    "kas_seharusnya": 470000,
    "uang_fisik": 470000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "eaa6a6c2-8381-598f-8bce-6d90094c2239",
    "diverifikasi_pada": "2026-10-04T11:50:00+07:00",
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "a9200124-867d-5c01-8275-180c01f96a80",
      "nama_lengkap": "Rizky Ramadhan",
      "email": "rizky.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": false
    }
  },
  {
    "id": "5677b4f7-8de8-5363-9fbe-50ca9f7c1a97",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-06T07:06:00+07:00",
    "ditutup_pada": "300000",
    "kas_awal": "2026-10-06T10:22:00+07:00",
    "total_tunai": 130000,
    "total_qris": 111600,
    "kas_seharusnya": 430000,
    "uang_fisik": 430000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "eaa6a6c2-8381-598f-8bce-6d90094c2239",
    "diverifikasi_pada": "2026-10-06T11:37:00+07:00",
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    }
  },
  {
    "id": "85a50bef-24a6-59df-9617-afb4761e20dd",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "kasir_id": "a9200124-867d-5c01-8275-180c01f96a80",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-09T07:06:00+07:00",
    "ditutup_pada": "300000",
    "kas_awal": "2026-10-09T11:26:00+07:00",
    "total_tunai": 232000,
    "total_qris": 124200,
    "kas_seharusnya": 532000,
    "uang_fisik": 532000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": "eaa6a6c2-8381-598f-8bce-6d90094c2239",
    "diverifikasi_pada": "2026-10-09T12:41:00+07:00",
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "a9200124-867d-5c01-8275-180c01f96a80",
      "nama_lengkap": "Rizky Ramadhan",
      "email": "rizky.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": false
    }
  },
  {
    "id": "223bd652-7599-562a-8584-e6a3721de931",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "diverifikasi",
    "dibuka_pada": "2026-10-11T07:04:00+07:00",
    "ditutup_pada": "300000",
    "kas_awal": "2026-10-11T11:38:00+07:00",
    "total_tunai": 0,
    "total_qris": 385000,
    "kas_seharusnya": 300000,
    "uang_fisik": 265000,
    "selisih": -35000,
    "catatan_selisih": "Kembalian ke pelanggan kemungkinan salah hitung, sudah dilaporkan ke kepala toko",
    "diverifikasi_oleh": "eaa6a6c2-8381-598f-8bce-6d90094c2239",
    "diverifikasi_pada": "2026-10-11T12:53:00+07:00",
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    }
  },
  {
    "id": "977abe18-7426-5c38-8348-474cd5fe7d6a",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "ditutup",
    "dibuka_pada": "2026-10-13T07:08:00+07:00",
    "ditutup_pada": "300000",
    "kas_awal": "2026-10-13T10:13:00+07:00",
    "total_tunai": 528000,
    "total_qris": 0,
    "kas_seharusnya": 828000,
    "uang_fisik": 828000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": null,
    "diverifikasi_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    }
  },
  {
    "id": "5b6aeaf2-53a1-5863-8118-8c3df986d4a1",
    "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
    "kasir_id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
    "status": "ditutup",
    "dibuka_pada": "2026-10-14T07:07:00+07:00",
    "ditutup_pada": "300000",
    "kas_awal": "2026-10-14T12:39:00+07:00",
    "total_tunai": 133000,
    "total_qris": 352200,
    "kas_seharusnya": 433000,
    "uang_fisik": 433000,
    "selisih": 0,
    "catatan_selisih": null,
    "diverifikasi_oleh": null,
    "diverifikasi_pada": null,
    "cabang": {
      "id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "kode": "DPK",
      "nama": "Lumbung Depok",
      "alamat": "Jl. Margonda Raya No. 210, Depok",
      "aktif": true
    },
    "kasir": {
      "id": "3c747ff5-3049-5ccb-ac0f-aeb896a2a611",
      "nama_lengkap": "Wulan Sari",
      "email": "wulan.kasir.depok@lumbung.test",
      "peran": "kasir",
      "cabang_id": "b76a9d0d-9422-5849-8829-756d702053b9",
      "aktif": true
    }
  }
];

export const SEED_HARGA_MODAL = [
  {
    "id": "c8c0d79d-be09-58bd-8c5c-d116a251148d",
    "produk_id": "ff9dd343-b627-5a17-a177-1a1d23e3439d",
    "harga_modal": 6000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "8b357862-b667-5499-a6f2-7d9bc6bb909f",
    "produk_id": "03ba6239-2efb-5fdc-95f2-4f74f4489dd8",
    "harga_modal": 7000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "865c1b6e-a0f7-5b08-a8ca-96f496cdf844",
    "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
    "harga_modal": 8500,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "a4ff1121-ea58-55e1-bc08-cebd20cbde48",
    "produk_id": "4bf1e555-3c86-53a0-9196-472bbe094338",
    "harga_modal": 9000,
    "berlaku_mulai": "2026-10-08T00:00:00+07:00"
  },
  {
    "id": "b1d3d19d-c9d6-5d29-9608-4a45e74773ba",
    "produk_id": "f1f24064-69f5-545e-b19c-71235a3ee074",
    "harga_modal": 10500,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "339ead71-f045-59d1-a09b-09524ed9c05d",
    "produk_id": "58043133-ec04-5c4d-840f-6cd5fb526c8a",
    "harga_modal": 10500,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "90ebd8a0-7e20-5f9c-97bc-a3c6cde5a639",
    "produk_id": "bb4a689e-6d20-5de3-aaa0-b5e98453d576",
    "harga_modal": 12500,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "73000220-ade5-5d70-9a85-e1d10d06e3fb",
    "produk_id": "88940f66-a081-5025-81b2-86ac7463ca47",
    "harga_modal": 10000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "0c7a72e5-2efe-5f40-8a76-770dc2913c0d",
    "produk_id": "2bf690a2-35e4-58cf-8c45-f373c15d7cee",
    "harga_modal": 6000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "fd992569-d36f-57dc-ab56-49d5e6af6d94",
    "produk_id": "c9ec01ff-7c25-5284-91a2-0354afdfc511",
    "harga_modal": 11000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "1ea26f32-bf8e-5b35-8873-52a60dbb731f",
    "produk_id": "b9a88e55-7705-5159-9f07-86b3e2913084",
    "harga_modal": 7500,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "8670e2e6-22e3-5323-8902-e1a8bed5a0dd",
    "produk_id": "a782db86-9f4c-5c12-a981-8b4dd14205e0",
    "harga_modal": 15000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "d41327ce-6ae3-5269-b7ba-b405e09af8fc",
    "produk_id": "f26530f3-0a9b-5b26-9136-750b5a5f55c0",
    "harga_modal": 4000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "93ee5a5d-6605-5b3f-8ac2-1a48496cf60f",
    "produk_id": "e6900790-c098-5fb8-be56-b0f4c11c15b0",
    "harga_modal": 9000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "3f038547-cfdf-59bb-9a2d-4af6c32c967b",
    "produk_id": "2b967038-d218-54c7-9c5f-26a893e01f11",
    "harga_modal": 16000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "1d3e21e3-3ca9-5b58-8fd0-fd7860903061",
    "produk_id": "e492a9b2-879d-503d-89bc-2b2d47be0ab4",
    "harga_modal": 9500,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "fabfe2e4-1ffa-529e-947c-986af42c79bf",
    "produk_id": "2d5fb5b3-fa19-5c74-b13a-04cf2bc8234e",
    "harga_modal": 48000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "f16aeacc-3019-5b15-8423-50e00dad2e25",
    "produk_id": "71c22606-2702-558e-b464-92af2dca8071",
    "harga_modal": 47000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  },
  {
    "id": "b028e43a-3df8-5f15-94a7-03e5c1ecfa49",
    "produk_id": "71c22606-2702-558e-b464-92af2dca8071",
    "harga_modal": 52000,
    "berlaku_mulai": "2026-10-08T00:00:00+07:00"
  },
  {
    "id": "6bf294a7-ad1c-50c4-9ecc-92523827b843",
    "produk_id": "9656c367-b523-52c0-b46d-5eabbdac5c99",
    "harga_modal": 70000,
    "berlaku_mulai": "2026-09-01T00:00:00+07:00"
  }
];
