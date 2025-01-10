import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // 라우터 임포트

createApp(App)
  .use(router) // Vue Router 사용
  .mount('#app');
