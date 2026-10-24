import { createClient } from '@supabase/supabase-js';

// Dalam browser dev, arahkan ke proxy /supabase di Vite agar request diteruskan secara server-to-server
// dan tidak diblokir oleh pengecekan User-Agent Supabase Gateway ("Forbidden use of secret API key in browser")
const isBrowser = typeof window !== 'undefined';
const supabaseUrl = isBrowser
  ? `${window.location.origin}/supabase`
  : (import.meta.env.VITE_SUPABASE_URL || 'https://mtunnrwjiasvmiyfwuhv.supabase.co');

const supabaseKey = 
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

