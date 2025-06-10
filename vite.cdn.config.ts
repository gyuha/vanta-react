import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// CDN 버전용 Vite 설정
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/lib/**'] // CDN 버전에서는 로컬 라이브러리 제외
    }),
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VantaReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'es' : ''}js`
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom',
        // CDN에서 로드되므로 번들에서 제외
        'three',
        'p5',
        'vanta'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          three: 'THREE',
          p5: 'p5',
          vanta: 'VANTA'
        }
      }
    },
    // CDN 버전에서는 로컬 라이브러리 파일 제외
    copyPublicDir: false
  },
  
  // 개발 서버 설정
  server: {
    port: 3001,
    open: '/cdn-demo.html'
  },
  
  // CDN 모드 환경 변수
  define: {
    __USE_CDN__: true,
    __DEV_MODE__: process.env.NODE_ENV === 'development'
  },
  
  // 정적 파일 처리
  publicDir: false // CDN 버전에서는 public 디렉토리 제외
});
