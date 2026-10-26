import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://mtunnrwjiasvmiyfwuhv.supabase.co';
// Gunakan Anon / Publishable key yang memang dirancang untuk aplikasi browser / frontend
const DEFAULT_ANON_KEY = 'sb_publishable_UBaWmggjC3s6fftld42rLQ_dDzqtCv0';

const isBrowser = typeof window !== 'undefined';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (isBrowser ? `${window.location.origin}/supabase` : DEFAULT_SUPABASE_URL);

// HANYA gunakan Anon / Publishable key di sisi browser!
// Jangan pernah gunakan Service Role Key (sb_secret_...) di browser
// karena Supabase Gateway akan menolak dengan pesan "Forbidden use of secret API key in browser".
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseKey = (envAnonKey && !envAnonKey.startsWith('sb_secret_'))
  ? envAnonKey
  : DEFAULT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});



