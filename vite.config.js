import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';
// Strip a trailing /api or /api/ from the configured API URL so the dev proxy doesn't double-append it
const apiTarget = apiUrl.endsWith('/api/')
  ? apiUrl.slice(0, -5)
  : apiUrl.endsWith('/api')
    ? apiUrl.slice(0, -4)
    : apiUrl;

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
