-- ==============================================================================
-- FIX: shift seed yang masih 'buka' (BR-01: "Anda sudah memiliki shift yang
-- masih berstatus buka")
-- Jalankan SEKALI di Supabase Dashboard -> SQL Editor, SETELAH 04_fix_sequence.sql.
--
-- Kasus: shift abd84bfa-186b-5825-bfae-330b162e3877 (Dimas Arya, Lumbung Tebut)
-- dibiarkan 'buka' oleh seed, padahal sudah punya 3 transaksi lunas.
-- total_tunai/total_qris-nya NULL, jadi ditutup lewat rpc_tutup_shift akan
-- menghasilkan kas_seharusnya & selisih NULL ("Rpundefined" di UI).
--
-- Total dihitung ulang dari tabel transaksi (bukan angka hardcode):
--   tunai = 146.000 (TBT-20261015-0003)
--   qris  = 238.000 (TBT-20261015-0001 + 0002)
--   kas_seharusnya = 500.000 + 146.000 = 646.000
-- ==============================================================================

-- 1. Cek prasyarat: pastikan tidak ada transaksi void yang belum terhitung
SELECT
    status,
    metode_bayar,
    COUNT(*) AS jumlah,
    SUM(total) AS total
FROM transaksi
WHERE shift_id = 'abd84bfa-186b-5825-bfae-330b162e3877'
GROUP BY status, metode_bayar
ORDER BY status, metode_bayar;

-- 2. Tutup shift dengan angka hasil rekonsiliasi transaksi
WITH agg AS (
    SELECT
        COALESCE(SUM(total) FILTER (WHERE metode_bayar = 'tunai' AND status = 'lunas'), 0) AS tunai,
        COALESCE(SUM(total) FILTER (WHERE metode_bayar = 'qris'  AND status = 'lunas'), 0) AS qris
    FROM transaksi
    WHERE shift_id = 'abd84bfa-186b-5825-bfae-330b162e3877'
)
UPDATE shift_kasir s
SET total_tunai    = agg.tunai,
    total_qris     = agg.qris,
    kas_seharusnya = s.kas_awal + agg.tunai,
    uang_fisik     = s.kas_awal + agg.tunai,   -- asumsi hitungan fisik pas
    selisih        = 0,
    status         = 'ditutup',
    ditutup_pada   = NOW(),
    catatan_tutup  = 'Penutupan shift bawaan seed (rekonsiliasi otomatis)'
FROM agg
WHERE s.id = 'abd84bfa-186b-5825-bfae-330b162e3877'
  AND s.status = 'buka';

-- 3. Verifikasi hasil
SELECT
    id, status, kas_awal, total_tunai, total_qris,
    kas_seharusnya, uang_fisik, selisih, ditutup_pada, catatan_tutup
FROM shift_kasir
WHERE id = 'abd84bfa-186b-5825-bfae-330b162e3877';
