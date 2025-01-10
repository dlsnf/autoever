import { createApp } from 'vue'; // Vue 3 애플리케이션 생성
import './style.css'; // 스타일 파일
import App from './App.vue'; // 루트 컴포넌트
import router from './router'; // Vue Router 설정


if (process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser');
  worker.start();
}


// Vue 애플리케이션 초기화
createApp(App)
  .use(router) // Vue Router 등록
  .mount('#app'); // #app 엘리먼트에 마운트
