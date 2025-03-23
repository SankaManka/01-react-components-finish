import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Удалите весь блок server - он НЕ нужен для production!
  base: '/', // Убедитесь, что base установлен корректно
  build: {
    outDir: 'dist',
    assetsDir: 'static'
  }
})