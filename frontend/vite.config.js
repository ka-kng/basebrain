import { defineConfig } from 'vite';
import React from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [React()],
  server: {
    host: true,
    port: 5174,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api': 'http://localhost:8080',
      '/sanctum': 'http://localhost:8080',
    }
  },
});
