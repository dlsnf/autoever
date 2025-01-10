import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import commonjs from 'vite-plugin-commonjs'; // commonjs 플러그인 가져오기

export default defineConfig({
  plugins: [vue(), commonjs()], // 플러그인 추가
  optimizeDeps: {
    include: ['msw'], // MSW를 디펜던시 최적화에 추가
  },
});
