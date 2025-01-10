node js 설치 후 Vite 프로젝트 생성
폴더명 : my-vue-app
프레임워크 : vue
npm create vite@latest my-vue-app -- --template vue



터미널로 해당 폴더 접근 후 install 설치c
npm install



개발 서버 실행
npm run dev


서버 종료
Ctrl + c


새로운페이지 라우터 설치
npm install vue-router





구조
root
index.html App.vue main.js

src/views //페이지들
src/router //페이지 연결 라우터
src/components //재사용 컴포넌트
src/assets //정적 리소스


src/
├── mocks/
│   ├── browser.js       // MSW 브라우저 설정
│   ├── handlers.js      // 요청 핸들러 정의
│   └── server.js        // 테스트 환경 설정용 (선택)
├── router/
├── App.vue
├── main.js (또는 index.js)
└── style.css




vsCode에서 터미널 열기
상단 메뉴에서 View → Terminal을 클릭하거나 단축키 Ctrl + ~를 사용해 터미널을 엽니다.


Git 초기화
git init


깃에 추가
git add .

추가된 파일 로컬 깃에 커밋
git commit -m "Initial commit"



프로젝트와 깃 연결
git remote add origin https://github.com/dlsnf/autoever.git


기본 브랜치 변경
git branch -M main

깃 허브로 푸시
git push -u origin main


수정된 파일 확인
git status


변경된 파일 추가
git add .

git add 파일이름


커밋

깃허브로 푸시
git push





<깃 연결 이후>
status - add - commit - push



git config --global user.name "dlsnf"
git config --global user.email "dlsnf@naver.com"













//프로젝트 깃헙에서 가져오기


vsCode터미널 실행 후 입력
git clone https://github.com/dlsnf/autoever.git



터미널에서 해당 경로 진입 후 install 및 run실행













예제화면

카테고리 2개
category?tab=CONSULT //서비스 도입
category?tab=USAGE //서비스 사용

카테고리별 내용들
faq?limit=10&offset=0&tab=CONSULT //서비스 도입의 내용들
faq?limit=10&offset=0&tab=USAGE //서비스 이용의 내용들


terms?termsClassID=JOIN_SERVICE_USE //이용 약관
terms?termsClassID=STARTADMIN_ADMIN_PRIVACY //개인정보 처리방침





MSW 프로젝트 설치
npm install msw --save-dev


msw public 폴더에 넣기
npx msw init public/ --save






cd C:\Users\dlsnf\Desktop\vite\autoever






// Proxy 객체를 JSON으로 변환
      const jsonObject = JSON.parse(JSON.stringify(this.feqConsultOrigin));
      console.log('첫 번째 item:', jsonObject.items);




컴포넌트 예시
<template>
  <div>
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="category in categories" :key="category.id">{{ category.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CategoryList",
  props: {
    title: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>


//컴포넌트 적용
<template>
  <div>
    <h1>Todo List</h1>
    <button @click="setCategory('CONSULT')">get Category CONSULT</button>
    <button @click="setCategory('USAGE')">get Category USAGE</button>
    
    <!-- CONSULT 카테고리 -->
    <CategoryList title="CONSULT Categories" :categories="categoryConsultOrigin" />

    <!-- USAGE 카테고리 -->
    <CategoryList title="USAGE Categories" :categories="categoryUsageOrigin" />
  </div>
</template>

<script>
import CategoryList from './CategoryList.vue';

export default {
  name: "Home",
  components: {
    CategoryList,
  },
  data() {
    return {
      selectCategory: "CONSULT",
      categoryConsultOrigin: [],
      categoryUsageOrigin: [],
      feqConsultOrigin: {},
      feqUsageOrigin: {},
    };
  },
  methods: {
    async fetchCategory(tab) {
      try {
        const fetchUrl = "/category?tab=" + tab;
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const data = await response.json();
          if (tab === "CONSULT") {
            this.categoryConsultOrigin = data;
          } else if (tab === "USAGE") {
            this.categoryUsageOrigin = data;
          }
        } else {
          console.error("Failed to fetch category:", response);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    },
    async fetchFeq(tab) {
      try {
        const fetchUrl = "/feq?tab=" + tab;
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const data = await response.json();
          if (tab === "CONSULT") {
            this.feqConsultOrigin = data;
          } else if (tab === "USAGE") {
            this.feqUsageOrigin = data;
          }
        } else {
          console.error("Failed to fetch feq:", response);
        }
      } catch (error) {
        console.error("Error fetching feq:", error);
      }
    },
    setCategory(str) {
      this.selectCategory = str;
    },
  },
  mounted() {
    this.fetchCategory("CONSULT");
    this.fetchCategory("USAGE");
    this.fetchFeq("CONSULT");
    this.fetchFeq("USAGE");
  },
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>




