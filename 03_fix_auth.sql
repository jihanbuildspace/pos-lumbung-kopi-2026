-- ==============================================================================
-- FIX SUPABASE AUTH UNTUK SEED USERS (LUMBUNG KOPI DAN ROTI)
-- Jalankan file ini di Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Perbaiki kolom token & change yang bernilai NULL di auth.users
-- (GoTrue Supabase memerlukan string kosong '' bukan NULL agar tidak error 500)
UPDATE auth.users
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  email_change = COALESCE(email_change, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  recovery_token = COALESCE(recovery_token, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
  is_sso_user = COALESCE(is_sso_user, FALSE);

-- 2. Daftarkan identitas provider 'email' ke auth.identities untuk semua akun seed
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
SELECT 
    id::text,
    id,
    jsonb_build_object('sub', id::text, 'email', email),
    'email',
    id::text,
    NOW(),
    NOW(),
    NOW()
FROM auth.users
ON CONFLICT DO NOTHING;

-- Verifikasi akun
SELECT id, email, role, confirmed_at FROM auth.users;
