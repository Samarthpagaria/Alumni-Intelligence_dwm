import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if (res.writeHead && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                success: false,
                message: 'DWM Backend API server is unreachable at http://localhost:5001. Please ensure DWM backend is running.',
                error: {
                  code: 'DWM_BACKEND_UNAVAILABLE',
                  message: 'DWM Backend API server is unreachable at http://localhost:5001. Please ensure DWM backend is running.',
                },
              }))
            }
          })
        },
      },
    },
  },
})
