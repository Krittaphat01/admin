import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5133, // กำหนดพอร์ต (ไม่จำเป็นต้องเปลี่ยนถ้าใช้ค่าดีฟอลต์)
    open: true, // เปิดเบราว์เซอร์อัตโนมัติเมื่อรัน dev server
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // ป้องกัน Vite แยกโค้ดออกเป็น chunks ที่อาจทำให้ routing พัง
      },
    },
  },
  esbuild: {
    
  },
});
