import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // permet l'accès via localhost, 127.0.0.1, ou IP locale
    port: 5173, // facultatif, pour fixer le port
  },
})
