<template>
    <header>
        <div class="inner">
            <a class="logo" href="/">Wible BIZ</a>
            <nav>
                <ul>
                <li><a href="/Guide">서비스 소개</a></li>
                <li class="active"><a href="/FAQ">자주 묻는 질문</a></li>
                <li><a href="/News">새소식</a></li>
                <li><a href="/Counsel">상담문의</a></li>
                </ul>
            </nav>
            <span class="util"><button type="button" class="nav" data-ui-click="nav-toggle">메뉴 열기/닫기</button></span>
        </div>
    </header>
</template>
  
  <script>
  export default {
    name: "header",
    props: {
      // 필요한 props 추가
    },
  };
  </script>
  
  <style scoped>
  /* 필요한 스타일 추가 */
  </style>