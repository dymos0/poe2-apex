import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-ui': ['radix-ui', 'cmdk', 'react-resizable-panels', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          'vendor-data': ['zustand', '@tanstack/react-query'],
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
})
