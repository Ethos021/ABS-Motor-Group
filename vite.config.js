import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Strip a trailing /api from the configured API URL so the dev proxy doesn't double-append it
const apiTarget = (process.env.VITE_API_URL || 'http://localhost:3000').replace(/\/api\/?$/, '');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    host: true,
    port: 8081,
    proxy: {
      '/api': apiTarget
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) 
