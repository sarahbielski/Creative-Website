import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  base: '/Creative-Website/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    // three + drei dominate the bundle; splitting them keeps the first paint
    // (frame, type, copy) independent of the 3D stage finishing its download.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
});
