-- ==============================================================================
-- CAPSTONE PROJECT: LUMBUNG KOPI DAN ROTI (POS MULTI-CABANG)
-- 100% SESUAI ERD_POS.pdf DAN PRD_POS.docx
-- ==============================================================================

-- Aktifkan ekstensi pgcrypto untuk UUID dan hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABEL CABANG
CREATE TABLE IF NOT EXISTS cabang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    alamat TEXT NOT NULL,
    aktif BOOLEAN NOT NULL DEFAULT TRUE,
    urut_struk_tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    urut_struk_terakhir INT NOT NULL DEFAULT 0
);

-- 2. TABEL PROFILES (terkait auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_lengkap TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    peran TEXT NOT NULL CHECK (peran IN ('kasir', 'kepala_toko', 'owner')),
    cabang_id UUID REFERENCES cabang(id) ON DELETE SET NULL,
    aktif BOOLEAN NOT NULL DEFAULT TRUE,
    dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABEL PRODUK
CREATE TABLE IF NOT EXISTS produk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    kategori TEXT NOT NULL CHECK (kategori IN ('kopi', 'non_kopi', 'roti', 'snack', 'kemasan')),
    harga_jual INT NOT NULL CHECK (harga_jual > 0),
    lacak_stok BOOLEAN NOT NULL DEFAULT TRUE,
    aktif BOOLEAN NOT NULL DEFAULT TRUE,
    diubah_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABEL RIWAYAT HARGA MODAL (RAHASIA OWNER - BR-11)
CREATE TABLE IF NOT EXISTS riwayat_harga_modal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    produk_id UUID NOT NULL REFERENCES produk(id) ON DELETE CASCADE,
    harga_modal INT NOT NULL CHECK (harga_modal >= 0),
    berlaku_mulai TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dibuat_oleh UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- 5. TABEL STOK CABANG
CREATE TABLE IF NOT EXISTS stok_cabang (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabang_id UUID NOT NULL REFERENCES cabang(id) ON DELETE CASCADE,
    produk_id UUID NOT NULL REFERENCES produk(id) ON DELETE CASCADE,
    jumlah INT NOT NULL CHECK (jumlah >= 0), -- BR-03: stok tidak boleh negatif
    stok_minimum INT NOT NULL DEFAULT 0 CHECK (stok_minimum >= 0),
    diubah_pada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_cabang_produk UNIQUE (cabang_id, produk_id)
);

-- 6. TABEL SHIFT KASIR
CREATE TABLE IF NOT EXISTS shift_kasir (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cabang_id UUID NOT NULL REFERENCES cabang(id) ON DELETE RESTRICT,
    kasir_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'buka' CHECK (status IN ('buka', 'ditutup', 'diverifikasi')),
    dibuka_pada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    kas_awal INT NOT NULL CHECK (kas_awal BETWEEN 0 AND 2000000), -- BR-02: kas awal 0 s.d 2.000.000
    ditutup_pada TIMESTAMPTZ,
    total_tunai INT DEFAULT 0,
    total_qris INT DEFAULT 0,
    kas_seharusnya INT,
    uang_fisik INT,
    selisih INT,
    catatan_tutup TEXT,
    diverifikasi_oleh UUID REFERENCES profiles(id) ON DELETE SET NULL,
    diverifikasi_pada TIMESTAMPTZ,
    catatan_verifikasi TEXT
);

-- 7. TABEL TRANSAKSI
CREATE TABLE IF NOT EXISTS transaksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_struk TEXT UNIQUE NOT NULL, -- BR-04: KODE-YYYYMMDD-NNNN
    cabang_id UUID NOT NULL REFERENCES cabang(id) ON DELETE RESTRICT,
    shift_id UUID NOT NULL REFERENCES shift_kasir(id) ON DELETE RESTRICT,
    kasir_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'lunas' CHECK (status IN ('lunas', 'void', 'menunggu_bayar', 'batal')),
    subtotal INT NOT NULL CHECK (subtotal >= 0),
    diskon INT NOT NULL DEFAULT 0 CHECK (diskon >= 0),
    alasan_diskon TEXT,
    total INT NOT NULL CHECK (total >= 0),
    metode_bayar TEXT NOT NULL CHECK (metode_bayar IN ('tunai', 'qris')),
    uang_diterima INT NOT NULL CHECK (uang_diterima >= 0),
    kembalian INT NOT NULL DEFAULT 0 CHECK (kembalian >= 0),
    dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dibayar_pada TIMESTAMPTZ,
    void_oleh UUID REFERENCES profiles(id) ON DELETE SET NULL,
    void_pada TIMESTAMPTZ,
    alasan_void TEXT,
    mayar_invoice_id TEXT
);

-- 8. TABEL TRANSAKSI ITEM
CREATE TABLE IF NOT EXISTS transaksi_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaksi_id UUID NOT NULL REFERENCES transaksi(id) ON DELETE CASCADE,
    produk_id UUID NOT NULL REFERENCES produk(id) ON DELETE RESTRICT,
    nama_produk TEXT NOT NULL,
    harga_satuan INT NOT NULL CHECK (harga_satuan > 0),
    jumlah INT NOT NULL CHECK (jumlah BETWEEN 1 AND 99), -- BR-05: 1 sampai 99
    subtotal INT NOT NULL CHECK (subtotal > 0)
);

-- 9. TABEL AUDIT LOG (IMMUTABLE - BR-12)
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    pelaku_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    aksi TEXT NOT NULL,
    tabel TEXT NOT NULL,
    data_id UUID NOT NULL,
    nilai_sebelum JSONB,
    nilai_sesudah JSONB,
    dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ATOMIC STORED PROCEDURES & BUSINESS LOGIC (BR-01 s.d. BR-12)
-- ==============================================================================

-- FUNGSI BR-04: GENERATE NOMOR STRUK ATOMIK DENGAN ROW-LOCKING
CREATE OR REPLACE FUNCTION generate_receipt_number(p_cabang_id UUID, p_tanggal DATE DEFAULT CURRENT_DATE)
RETURNS TEXT AS $$
DECLARE
    v_cabang RECORD;
    v_seq INT;
    v_nomor_struk TEXT;
BEGIN
    -- Kunci baris cabang agar kasir lain menunggu (anti-race condition)
    SELECT * INTO v_cabang FROM cabang WHERE id = p_cabang_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cabang tidak ditemukan';
    END IF;

    IF v_cabang.urut_struk_tanggal <> p_tanggal THEN
        v_seq := 1;
        UPDATE cabang 
        SET urut_struk_tanggal = p_tanggal, urut_struk_terakhir = 1 
        WHERE id = p_cabang_id;
    ELSE
        v_seq := v_cabang.urut_struk_terakhir + 1;
        UPDATE cabang 
        SET urut_struk_terakhir = v_seq 
        WHERE id = p_cabang_id;
    END IF;

    v_nomor_struk := v_cabang.kode || '-' || to_char(p_tanggal, 'YYYYMMDD') || '-' || lpad(v_seq::TEXT, 4, '0');
    RETURN v_nomor_struk;
END;
$$ LANGUAGE plpgsql;

-- FUNGSI BR-02, BR-03, BR-05, BR-06, BR-07: ATOMIC CHECKOUT
CREATE OR REPLACE FUNCTION rpc_checkout_transaksi(p_payload JSONB)
RETURNS JSONB AS $$
DECLARE
    v_cabang_id UUID := (p_payload->>'cabang_id')::UUID;
    v_shift_id UUID := (p_payload->>'shift_id')::UUID;
    v_kasir_id UUID := (p_payload->>'kasir_id')::UUID;
    v_metode_bayar TEXT := p_payload->>'metode_bayar';
    v_uang_diterima INT := (p_payload->>'uang_diterima')::INT;
    v_diskon INT := COALESCE((p_payload->>'diskon')::INT, 0);
    v_alasan_diskon TEXT := p_payload->>'alasan_diskon';
    v_items JSONB := p_payload->'items';
    
    v_shift RECORD;
    v_subtotal INT := 0;
    v_total INT;
    v_kembalian INT;
    v_nomor_struk TEXT;
    v_transaksi_id UUID;
    v_item JSONB;
    v_prod RECORD;
    v_stok RECORD;
    v_item_subtotal INT;
    v_qty INT;
BEGIN
    -- BR-02: Cek shift kasir harus buka
    SELECT * INTO v_shift FROM shift_kasir WHERE id = v_shift_id AND kasir_id = v_kasir_id FOR UPDATE;
    IF NOT FOUND OR v_shift.status <> 'buka' THEN
        RAISE EXCEPTION 'Shift kasir tidak aktif atau bukan berstatus buka (BR-02)';
    END IF;

    -- Hitung subtotal dan validasi item
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
    LOOP
        v_qty := (v_item->>'jumlah')::INT;
        IF v_qty < 1 OR v_qty > 99 THEN
            RAISE EXCEPTION 'Jumlah item per produk harus 1 sampai 99 (BR-05)';
        END IF;

        SELECT * INTO v_prod FROM produk WHERE id = (v_item->>'produk_id')::UUID;
        IF NOT FOUND OR NOT v_prod.aktif THEN
            RAISE EXCEPTION 'Produk tidak valid atau nonaktif (BR-05)';
        END IF;

        v_item_subtotal := v_prod.harga_jual * v_qty;
        v_subtotal := v_subtotal + v_item_subtotal;

        -- BR-03: Kunci dan cek stok jika lacak_stok = true
        IF v_prod.lacak_stok THEN
            SELECT * INTO v_stok FROM stok_cabang 
            WHERE cabang_id = v_cabang_id AND produk_id = v_prod.id FOR UPDATE;
            
            IF NOT FOUND OR v_stok.jumlah < v_qty THEN
                RAISE EXCEPTION 'Stok produk % tidak mencukupi (sisa: %, diminta: %) (BR-03)', 
                    v_prod.nama, COALESCE(v_stok.jumlah, 0), v_qty;
            END IF;
            
            -- Kurangi stok
            UPDATE stok_cabang 
            SET jumlah = jumlah - v_qty, diubah_pada = NOW() 
            WHERE id = v_stok.id;
        END IF;
    END LOOP;

    -- BR-06: Diskon maksimal 10% dan wajib alasan jika > 0
    IF v_diskon > 0 THEN
        IF v_diskon > (v_subtotal * 0.10) THEN
            RAISE EXCEPTION 'Diskon tidak boleh lebih dari 10%% dari subtotal (BR-06)';
        END IF;
        IF v_alasan_diskon IS NULL OR length(trim(v_alasan_diskon)) = 0 THEN
            RAISE EXCEPTION 'Diskon wajib disertai alasan (BR-06)';
        END IF;
    END IF;

    v_total := v_subtotal - v_diskon;

    -- BR-07: Pembayaran tunai vs QRIS
    IF v_metode_bayar = 'tunai' THEN
        IF v_uang_diterima < v_total THEN
            RAISE EXCEPTION 'Uang tunai yang diterima kurang dari total pembayaran (BR-07)';
        END IF;
        v_kembalian := v_uang_diterima - v_total;
    ELSIF v_metode_bayar = 'qris' THEN
        v_uang_diterima := v_total;
        v_kembalian := 0;
    ELSE
        RAISE EXCEPTION 'Metode bayar tidak valid (BR-07)';
    END IF;

    -- BR-04: Generate nomor struk atomik
    v_nomor_struk := generate_receipt_number(v_cabang_id, CURRENT_DATE);
    v_transaksi_id := gen_random_uuid();

    -- Simpan Transaksi
    INSERT INTO transaksi (
        id, nomor_struk, cabang_id, shift_id, kasir_id, status, 
        subtotal, diskon, alasan_diskon, total, metode_bayar, 
        uang_diterima, kembalian, dibuat_pada, dibayar_pada
    ) VALUES (
        v_transaksi_id, v_nomor_struk, v_cabang_id, v_shift_id, v_kasir_id, 'lunas',
        v_subtotal, v_diskon, v_alasan_diskon, v_total, v_metode_bayar,
        v_uang_diterima, v_kembalian, NOW(), NOW()
    );

    -- Simpan Item Transaksi
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
    LOOP
        SELECT * INTO v_prod FROM produk WHERE id = (v_item->>'produk_id')::UUID;
        v_qty := (v_item->>'jumlah')::INT;
        INSERT INTO transaksi_item (
            transaksi_id, produk_id, nama_produk, harga_satuan, jumlah, subtotal
        ) VALUES (
            v_transaksi_id, v_prod.id, v_prod.nama, v_prod.harga_jual, v_qty, v_prod.harga_jual * v_qty
        );
    END LOOP;

    -- Update total shift kasir
    IF v_metode_bayar = 'tunai' THEN
        UPDATE shift_kasir 
        SET total_tunai = total_tunai + v_total,
            kas_seharusnya = kas_awal + total_tunai + v_total
        WHERE id = v_shift_id;
    ELSE
        UPDATE shift_kasir 
        SET total_qris = total_qris + v_total 
        WHERE id = v_shift_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'transaksi_id', v_transaksi_id,
        'nomor_struk', v_nomor_struk,
        'total', v_total,
        'kembalian', v_kembalian
    );
END;
$$ LANGUAGE plpgsql;

-- FUNGSI BR-08: VOID TRANSAKSI
CREATE OR REPLACE FUNCTION rpc_void_transaksi(p_transaksi_id UUID, p_user_id UUID, p_alasan TEXT)
RETURNS JSONB AS $$
DECLARE
    v_user RECORD;
    v_trans RECORD;
    v_shift RECORD;
    v_item RECORD;
BEGIN
    SELECT * INTO v_user FROM profiles WHERE id = p_user_id;
    IF NOT FOUND OR NOT v_user.aktif THEN
        RAISE EXCEPTION 'Pengguna tidak ditemukan atau nonaktif';
    END IF;

    SELECT * INTO v_trans FROM transaksi WHERE id = p_transaksi_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaksi tidak ditemukan';
    END IF;

    IF v_trans.status <> 'lunas' THEN
        RAISE EXCEPTION 'Hanya transaksi berstatus lunas yang dapat di-void (BR-08)';
    END IF;

    -- BR-08: Void hanya oleh Kepala Toko cabang tersebut atau Owner
    IF v_user.peran = 'kasir' THEN
        RAISE EXCEPTION 'Kasir tidak berwenang melakukan void transaksi (BR-08)';
    END IF;
    IF v_user.peran = 'kepala_toko' AND v_user.cabang_id <> v_trans.cabang_id THEN
        RAISE EXCEPTION 'Kepala Toko hanya bisa void transaksi di cabangnya sendiri (BR-08)';
    END IF;

    -- BR-08: Hanya transaksi dibuat hari ini
    IF (v_trans.dibuat_pada AT TIME ZONE 'Asia/Jakarta')::DATE <> (NOW() AT TIME ZONE 'Asia/Jakarta')::DATE THEN
        RAISE EXCEPTION 'Hanya transaksi yang dibuat hari ini yang dapat di-void (BR-08)';
    END IF;

    -- BR-08: Shift transaksi harus masih buka
    SELECT * INTO v_shift FROM shift_kasir WHERE id = v_trans.shift_id FOR UPDATE;
    IF NOT FOUND OR v_shift.status <> 'buka' THEN
        RAISE EXCEPTION 'Shift transaksi sudah ditutup, tidak dapat di-void (BR-08)';
    END IF;

    -- BR-08: Alasan void minimal 10 karakter
    IF p_alasan IS NULL OR length(trim(p_alasan)) < 10 THEN
        RAISE EXCEPTION 'Alasan void minimal 10 karakter (BR-08)';
    END IF;

    -- Kembalikan stok item yang dilacak
    FOR v_item IN SELECT ti.*, p.lacak_stok FROM transaksi_item ti 
                  JOIN produk p ON ti.produk_id = p.id 
                  WHERE ti.transaksi_id = p_transaksi_id
    LOOP
        IF v_item.lacak_stok THEN
            UPDATE stok_cabang 
            SET jumlah = jumlah + v_item.jumlah, diubah_pada = NOW() 
            WHERE cabang_id = v_trans.cabang_id AND produk_id = v_item.produk_id;
        END IF;
    END LOOP;

    -- Update transaksi status void
    UPDATE transaksi 
    SET status = 'void',
        void_oleh = p_user_id,
        void_pada = NOW(),
        alasan_void = p_alasan
    WHERE id = p_transaksi_id;

    -- Kurangi total shift jika metode tunai
    IF v_trans.metode_bayar = 'tunai' THEN
        UPDATE shift_kasir 
        SET total_tunai = total_tunai - v_trans.total,
            kas_seharusnya = kas_seharusnya - v_trans.total
        WHERE id = v_trans.shift_id;
    ELSE
        UPDATE shift_kasir 
        SET total_qris = total_qris - v_trans.total
        WHERE id = v_trans.shift_id;
    END IF;

    -- BR-12: Catat ke audit_log
    INSERT INTO audit_log (pelaku_id, aksi, tabel, data_id, nilai_sebelum, nilai_sesudah, dibuat_pada)
    VALUES (
        p_user_id, 
        'void_transaksi', 
        'transaksi', 
        p_transaksi_id, 
        jsonb_build_object('status', 'lunas', 'total', v_trans.total),
        jsonb_build_object('status', 'void', 'alasan', p_alasan),
        NOW()
    );

    RETURN jsonb_build_object('success', true, 'nomor_struk', v_trans.nomor_struk);
END;
$$ LANGUAGE plpgsql;

-- FUNGSI BR-09: TUTUP SHIFT
CREATE OR REPLACE FUNCTION rpc_tutup_shift(p_shift_id UUID, p_uang_fisik INT, p_catatan TEXT)
RETURNS JSONB AS $$
DECLARE
    v_shift RECORD;
    v_kas_seharusnya INT;
    v_selisih INT;
BEGIN
    SELECT * INTO v_shift FROM shift_kasir WHERE id = p_shift_id FOR UPDATE;
    IF NOT FOUND OR v_shift.status <> 'buka' THEN
        RAISE EXCEPTION 'Shift tidak ditemukan atau sudah tidak berstatus buka (BR-09)';
    END IF;

    -- COALESCE: total_tunai bisa NULL (shift baru / data seed lama)
    v_kas_seharusnya := v_shift.kas_awal + COALESCE(v_shift.total_tunai, 0);
    v_selisih := p_uang_fisik - v_kas_seharusnya;

    -- BR-09: Selisih lebih dari Rp20.000 wajib ada catatan
    IF abs(v_selisih) > 20000 THEN
        IF p_catatan IS NULL OR length(trim(p_catatan)) = 0 THEN
            RAISE EXCEPTION 'Selisih kas lebih dari Rp20.000 wajib menyertakan catatan kasir (BR-09)';
        END IF;
    END IF;

    UPDATE shift_kasir 
    SET status = 'ditutup',
        ditutup_pada = NOW(),
        kas_seharusnya = v_kas_seharusnya,
        uang_fisik = p_uang_fisik,
        selisih = v_selisih,
        catatan_tutup = p_catatan
    WHERE id = p_shift_id;

    RETURN jsonb_build_object(
        'success', true, 
        'kas_seharusnya', v_kas_seharusnya, 
        'selisih', v_selisih
    );
END;
$$ LANGUAGE plpgsql;

-- FUNGSI BR-10: VERIFIKASI SHIFT
CREATE OR REPLACE FUNCTION rpc_verifikasi_shift(p_shift_id UUID, p_user_id UUID, p_catatan TEXT)
RETURNS JSONB AS $$
DECLARE
    v_user RECORD;
    v_shift RECORD;
BEGIN
    SELECT * INTO v_user FROM profiles WHERE id = p_user_id;
    IF NOT FOUND OR NOT v_user.aktif THEN
        RAISE EXCEPTION 'Pengguna tidak ditemukan atau nonaktif';
    END IF;

    SELECT * INTO v_shift FROM shift_kasir WHERE id = p_shift_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Shift tidak ditemukan';
    END IF;

    IF v_shift.status <> 'ditutup' THEN
        RAISE EXCEPTION 'Hanya shift berstatus ditutup yang dapat diverifikasi (BR-10)';
    END IF;

    IF v_user.peran = 'kasir' THEN
        RAISE EXCEPTION 'Kasir tidak berwenang memverifikasi shift (BR-10)';
    END IF;
    IF v_user.peran = 'kepala_toko' AND v_user.cabang_id <> v_shift.cabang_id THEN
        RAISE EXCEPTION 'Kepala Toko hanya bisa memverifikasi shift di cabangnya sendiri (BR-10)';
    END IF;

    UPDATE shift_kasir 
    SET status = 'diverifikasi',
        diverifikasi_oleh = p_user_id,
        diverifikasi_pada = NOW(),
        catatan_verifikasi = p_catatan
    WHERE id = p_shift_id;

    -- BR-12: Catat ke audit log
    INSERT INTO audit_log (pelaku_id, aksi, tabel, data_id, nilai_sebelum, nilai_sesudah, dibuat_pada)
    VALUES (
        p_user_id,
        'verifikasi_shift',
        'shift_kasir',
        p_shift_id,
        jsonb_build_object('status', 'ditutup'),
        jsonb_build_object('status', 'diverifikasi', 'selisih', v_shift.selisih, 'catatan', p_catatan),
        NOW()
    );

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql;

-- FUNGSI BR-12: PENYESUAIAN STOK
CREATE OR REPLACE FUNCTION rpc_sesuaikan_stok(
    p_cabang_id UUID, 
    p_produk_id UUID, 
    p_jumlah_baru INT, 
    p_alasan TEXT, 
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_user RECORD;
    v_stok RECORD;
    v_jumlah_lama INT;
BEGIN
    SELECT * INTO v_user FROM profiles WHERE id = p_user_id;
    IF NOT FOUND OR NOT v_user.aktif THEN
        RAISE EXCEPTION 'Pengguna tidak ditemukan atau nonaktif';
    END IF;

    IF v_user.peran = 'kasir' THEN
        RAISE EXCEPTION 'Kasir tidak berwenang melakukan penyesuaian stok (BR-12)';
    END IF;
    IF v_user.peran = 'kepala_toko' AND v_user.cabang_id <> p_cabang_id THEN
        RAISE EXCEPTION 'Kepala Toko hanya berwenang di cabangnya sendiri (BR-12)';
    END IF;

    IF p_jumlah_baru < 0 THEN
        RAISE EXCEPTION 'Jumlah stok tidak boleh negatif (BR-03)';
    END IF;
    IF p_alasan IS NULL OR length(trim(p_alasan)) = 0 THEN
        RAISE EXCEPTION 'Penyesuaian stok wajib menyertakan alasan (BR-12)';
    END IF;

    SELECT * INTO v_stok FROM stok_cabang 
    WHERE cabang_id = p_cabang_id AND produk_id = p_produk_id FOR UPDATE;

    IF NOT FOUND THEN
        v_jumlah_lama := 0;
        INSERT INTO stok_cabang (cabang_id, produk_id, jumlah, diubah_pada)
        VALUES (p_cabang_id, p_produk_id, p_jumlah_baru, NOW())
        RETURNING * INTO v_stok;
    ELSE
        v_jumlah_lama := v_stok.jumlah;
        UPDATE stok_cabang 
        SET jumlah = p_jumlah_baru, diubah_pada = NOW() 
        WHERE id = v_stok.id;
    END IF;

    -- Catat ke audit log
    INSERT INTO audit_log (pelaku_id, aksi, tabel, data_id, nilai_sebelum, nilai_sesudah, dibuat_pada)
    VALUES (
        p_user_id,
        'penyesuaian_stok',
        'stok_cabang',
        v_stok.id,
        jsonb_build_object('jumlah', v_jumlah_lama),
        jsonb_build_object('jumlah', p_jumlah_baru, 'alasan', p_alasan),
        NOW()
    );

    RETURN jsonb_build_object('success', true, 'jumlah_lama', v_jumlah_lama, 'jumlah_baru', p_jumlah_baru);
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- RLS POLICIES (ROW LEVEL SECURITY)
-- ==============================================================================
ALTER TABLE cabang ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE riwayat_harga_modal ENABLE ROW LEVEL SECURITY;
ALTER TABLE stok_cabang ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_kasir ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user profile
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS profiles AS $$
    SELECT * FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Cabang Policies: Semua user aktif bisa melihat cabang
CREATE POLICY "cabang_select_policy" ON cabang FOR SELECT TO authenticated
USING (aktif = true);

-- 2. Profiles Policies
CREATE POLICY "profiles_select_policy" ON profiles FOR SELECT TO authenticated
USING (
    id = auth.uid() 
    OR (SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner'
    OR ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'kepala_toko' AND cabang_id = (SELECT cabang_id FROM profiles WHERE id = auth.uid()))
);

-- 3. Produk Policies: Semua user aktif bisa melihat produk aktif (owner bisa lihat semua)
CREATE POLICY "produk_select_policy" ON produk FOR SELECT TO authenticated
USING (
    aktif = true 
    OR (SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner'
);
CREATE POLICY "produk_owner_all" ON produk FOR ALL TO authenticated
USING ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner');

-- 4. Riwayat Harga Modal: KHUSUS OWNER (BR-11)
CREATE POLICY "modal_owner_only" ON riwayat_harga_modal FOR ALL TO authenticated
USING ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner');

-- 5. Stok Cabang Policies
CREATE POLICY "stok_select_policy" ON stok_cabang FOR SELECT TO authenticated
USING (
    (SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner'
    OR cabang_id = (SELECT cabang_id FROM profiles WHERE id = auth.uid())
);

-- 6. Shift Kasir Policies
CREATE POLICY "shift_select_policy" ON shift_kasir FOR SELECT TO authenticated
USING (
    (SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner'
    OR ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'kepala_toko' AND cabang_id = (SELECT cabang_id FROM profiles WHERE id = auth.uid()))
    OR ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'kasir' AND kasir_id = auth.uid())
);

-- 7. Transaksi Policies
CREATE POLICY "transaksi_select_policy" ON transaksi FOR SELECT TO authenticated
USING (
    (SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner'
    OR ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'kepala_toko' AND cabang_id = (SELECT cabang_id FROM profiles WHERE id = auth.uid()))
    OR ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'kasir' AND kasir_id = auth.uid())
);

-- 8. Transaksi Item Policies
CREATE POLICY "transaksi_item_select_policy" ON transaksi_item FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM transaksi t 
        WHERE t.id = transaksi_item.transaksi_id
        AND (
            (SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner'
            OR ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'kepala_toko' AND t.cabang_id = (SELECT cabang_id FROM profiles WHERE id = auth.uid()))
            OR ((SELECT peran FROM profiles WHERE id = auth.uid()) = 'kasir' AND t.kasir_id = auth.uid())
        )
    )
);

-- 9. Audit Log: Hanya Owner dan Kepala Toko cabangnya
CREATE POLICY "audit_log_select_policy" ON audit_log FOR SELECT TO authenticated
USING (
    (SELECT peran FROM profiles WHERE id = auth.uid()) = 'owner'
    OR (SELECT peran FROM profiles WHERE id = auth.uid()) = 'kepala_toko'
);
