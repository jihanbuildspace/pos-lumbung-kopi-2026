import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://mtunnrwjiasvmiyfwuhv.supabase.co';
// Fallback key agar createClient tidak melempar 'supabaseKey is required'
// saat aplikasi pertama kali dijalankan di hosting Netlify.
const FALLBACK_KEY = 'dummy-anon-key-pos-lumbung-kopi';

const isBrowser = typeof window !== 'undefined';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (isBrowser ? `${window.location.origin}/supabase` : DEFAULT_SUPABASE_URL);

const supabaseKey =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});



