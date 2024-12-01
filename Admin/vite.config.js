import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // ระบุการตั้งค่า PostCSS
  },
  server: {
    port: 5174, // ตั้งค่าพอร์ตสำหรับ development
    historyApiFallback: true, // เพิ่ม Fallback Routing สำหรับ SPA
  },
  build: {
    outDir: 'dist', // กำหนดโฟลเดอร์ที่ใช้สำหรับ build
  },
});
