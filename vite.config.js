import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 5174 (y Supabase local en 553xx) para poder tener a la vez otro CRM en el puerto por defecto de Vite (5173)
  server: { port: 5174, strictPort: true },
})
