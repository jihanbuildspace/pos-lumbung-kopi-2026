import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/supabase': {
        target: 'https://mtunnrwjiasvmiyfwuhv.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
        headers: {
          'User-Agent': 'Node-Supabase-Internal-Client/1.0',
        },
      },
    },
  },
  build: {
    cssMinify: false,
  },
})

