import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export const alias = {
  '@': path.resolve(__dirname, 'src'),
  '@/config': path.resolve(__dirname, 'src/config'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/data': path.resolve(__dirname, 'src/data'),
  '@/lib': path.resolve(__dirname, 'src/lib'),
  '@/test': path.resolve(__dirname, '__tests__'),
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias,
  },
  server: {
    port: Number(process.env.PORT) || 3000,
    proxy: !process.env.VITE_MOCK_SERVER
      ? {
          '/api': `http://${process.env.API_URL}`,
        }
      : undefined,
  },
});
