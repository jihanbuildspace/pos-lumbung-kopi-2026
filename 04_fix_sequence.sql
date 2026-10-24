-- ==============================================================================
-- FIX: "duplicate key value violates unique constraint audit_log_pkey"
-- Jalankan file ini SEKALI di Supabase Dashboard -> SQL Editor.
--
-- Penyebab: 02_seed.sql mengisi audit_log.id secara eksplisit (1..26) tanpa
-- memajukan sequence BIGSERIAL, sehingga nextval() mengembalikan id yang
-- sudah terpakai. INSERT dari rpc_verifikasi_shift / rpc_void_transaksi /
-- rpc_sesuaikan_stok pun gagal.
-- ==============================================================================

-- 1. Lihat kondisi saat ini (opsional, untuk bukti)
--    pg_get_serial_sequence dipakai agar tidak bergantung pada nama schema.
SELECT
    pg_get_serial_sequence('audit_log', 'id') AS sequence_name,
    pg_sequence_last_value(pg_get_serial_sequence('audit_log', 'id')) AS sequence_last_value,
    (SELECT COALESCE(MAX(id), 0) FROM audit_log) AS max_id;

-- 2. Sinkronkan sequence ke MAX(id) yang benar-benar ada
--    (is_called = false agar id berikutnya tepat MAX(id) + 1)
SELECT setval(
    pg_get_serial_sequence('audit_log', 'id'),
    COALESCE((SELECT MAX(id) FROM audit_log), 0) + 1,
    false
);

-- 3. Verifikasi: sequence_last_value harus = max_id + 1
SELECT
    pg_get_serial_sequence('audit_log', 'id') AS sequence_name,
    pg_sequence_last_value(pg_get_serial_sequence('audit_log', 'id')) AS sequence_last_value,
    (SELECT COALESCE(MAX(id), 0) FROM audit_log) AS max_id;
