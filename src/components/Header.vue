<template>
    <header>
        <div class="inner">
            <a class="logo" href="/">Wible BIZ</a>
            <nav>
                <ul>
                <li><a href="#">서비스 소개</a></li>
                <li class="active"><a href="/FAQ">자주 묻는 질문</a></li>
                <li><a href="#">새소식</a></li>
                <li><a href="#">상담문의</a></li>
                </ul>
            </nav>
            <span class="util"><button type="button" class="nav" data-ui-click="nav-toggle" @click="menuToggle()">메뉴 열기/닫기</button></span>
        </div>
    </header>
</template>
  
  <script>
  export default {
    name: "header",
    props: {
      // 필요한 props 추가
    },
    data() {
      return {
        // 필요한 data 추가
        menuOpen: false,
      };
    },
    methods: {

      // 메뉴 열기/닫기
      menuToggle(){

        if(this.menuOpen)
        {
          this.menuOpen = false;
          if(document.body.classList.contains('nav-opened'))
          {
            document.body.classList.remove('nav-opened');
          }
        }else{
          this.menuOpen = true;
          if(!document.body.classList.contains('nav-opened'))
          {
            document.querySelector('body').classList.add('nav-opened');
          }
        }
      }

    },
  };
  </script>
  
  <style scoped>
  /* 필요한 스타일 추가 */
  </style>