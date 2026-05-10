// import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config';

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    strictPort: true,   // Không tự nhảy port nếu 5173 bị chiếm
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  }
})
