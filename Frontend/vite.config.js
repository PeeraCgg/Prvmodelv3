import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  console.log(`Current mode: ${mode}`);

  // โหลดค่าจากไฟล์ .env ตาม mode ที่ใช้งาน
  const env = {
    developer: {
      apiURL: 'http://localhost:3000', // URL ของ API backend สำหรับ development
    },
    production: {
      apiURL: 'https://api.production.com', // URL ของ API backend สำหรับ production
    },
  };

  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.cjs', // ใช้งาน Tailwind CSS ผ่าน PostCSS
    },
    define: {
      'process.env.BASE_URL': JSON.stringify(env[mode]?.apiURL || ''),
    },
    server: {
       // ตั้งค่า port สำหรับ development ค่าเริ่มต้น 5173
    },
    build: {
      outDir: 'dist', // กำหนดโฟลเดอร์ที่ใช้สำหรับ build
    },
  };
});
