import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8800', // Адрес бэка
        changeOrigin: true, // Меняет origin запроса (важно для CORS)
        secure: false, // Выключаем проверку SSL (если локально)
        ws: true,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:5173',
        },
      },
    },
    cors: true,
  },
})
