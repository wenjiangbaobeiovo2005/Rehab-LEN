import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: './', // Use relative paths for deployment
  build: {
    outDir: 'dist', // Output directory
    assetsDir: 'assets', // Assets directory
    rollupOptions: {
      output: {
        manualChunks: undefined // Put all JS in a single file for simplicity
      }
    }
  }
})