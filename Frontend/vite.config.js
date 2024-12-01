import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ''); // โหลด Environment Variables

  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.cjs', // ใช้งาน Tailwind CSS ผ่าน PostCSS
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL), // ใช้ VITE_API_URL
    },
    server: {
      port: 5173, // ตั้งค่าพอร์ตสำหรับ development
      historyApiFallback: true, // เพิ่ม Fallback Routing สำหรับ SPA
    },
    build: {
      outDir: 'dist', // กำหนดโฟลเดอร์ที่ใช้สำหรับ build
    },
  };
});
