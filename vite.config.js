import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/* GitHub Pages 가 하위 주소에서 없는 경로를 만나면 404.html 을 준다.
   index.html 을 그대로 복사해 두면 /minamo-case/ja 처럼 새로고침해도 같은 화면이 열린다. */
function pagesFallback() {
  return {
    name: 'pages-404-fallback',
    closeBundle() {
      const out = resolve(process.cwd(), 'dist');
      const index = resolve(out, 'index.html');
      if (existsSync(index)) copyFileSync(index, resolve(out, '404.html'));
    },
  };
}

// MINAMO 케이스 스터디. 포트 5201. 배포 주소 https://hyunho2378.github.io/minamo-case/
export default defineConfig({
  base: '/minamo-case/',
  plugins: [react(), pagesFallback()],
  server: { port: 5201, strictPort: true },
  preview: { port: 5201, strictPort: true },
});
