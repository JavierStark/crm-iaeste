import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5174 (y Supabase local en 553xx) para poder tenerlo encendido a la vez que el CRM de Málaga
  server: { port: 5174, strictPort: true },
})
