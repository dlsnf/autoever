import { createApp } from 'vue'; // Vue 3 애플리케이션 생성
import './style.css'; // 스타일 파일
import App from './App.vue'; // 루트 컴포넌트
import router from './router'; // Vue Router 설정


async function prepareApp() {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }

  return Promise.resolve()
}

// Vue 애플리케이션 초기화
const app = createApp(App)
  .use(router) // Vue Router 등록
  // .mount('#app'); // #app 엘리먼트에 마운트

prepareApp().then(() => {
  app.mount('#app')
})




