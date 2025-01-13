<template>
  <div class="wrapper">
    <i class="sticky-checker"></i>

    <!-- 헤더 -->
    <Header></Header>

    <div class="container">
      <div class="content">
        <h1>자주 묻는 질문 <em>궁금하신 내용을 빠르게 찾아보세요.</em></h1>

        <!-- 탭 -->
        <ul class="tabs">
          <li :class="{ active: selectTab === 'CONSULT' }" @click="setTab('CONSULT')"><a><span>서비스 도입</span></a>
          </li>
          <li :class="{ active: selectTab === 'USAGE' }" @click="setTab('USAGE')"><a><span>서비스 이용</span></a></li>
        </ul>

        <!-- 검색 -->
        <form @submit.prevent>
          <div class="search">
            <div class="input-wrap"><input type="text" placeholder="찾으시는 내용을 입력해 주세요" value=""
                v-model="searchKeywordOutput" @keyup.enter="handleEnter">
              <button type="button" class="clear" data-ui-click="input-clear" @click="clearInput()">다시입력</button>
              <button type="button" class="submit" @click="searchClick()">검색</button>
            </div>
          </div>
        </form>

        <!-- 카테고리 추가 -->
        <div class="filter">
          <label :class="{ selected: selectedCategoryId === null && categoryOutput.length > 0 }"
            @click="selectSubCategory(null, null)"><input class="allCategoryInput" type="radio" name="filter"
              checked=""><i>전체</i></label>
          <label v-for="(category, index) in categoryOutput" :key="index"
            :class="{ selected: selectedCategoryId === category.categoryID }"
            @click="selectSubCategory(category.categoryID, category.name)"><input type="radio" name="filter"><i>{{
              category.name }}</i></label>
        </div>

        <!-- FAQ 항목 -->
        <ul class="faq-list">
          <div class="no-data" v-if="displayedFAQs.items && displayedFAQs.items.length == 0">
            <p>검색결과가 없습니다.</p>
          </div>

          <li data-ui-item="true" v-for="(item, index) in displayedFAQs.items" :key="index"
            :class="{ active: activeIndex === index, ing: ingIndex === index, ing2: preIngIndex === index, show: showIndex === index }">
            <!-- Q&A 버튼 -->
            <h4 class="a">
              <button type="button" data-ui-click="dropdown-toggle" @click="toggleItem(index)"><em>{{ selectTab ==
                "CONSULT" ? item.subCategoryName : item.categoryName
                  }}</em><strong>{{ item.question }}</strong></button>
            </h4>
            <!-- 답변 -->
            <div class="q" ref="faqContents">
              <div class="inner" v-html="item.answer"></div>
            </div>
          </li>
        </ul>

        <!-- 서비스 문의 -->
        <h2 class="heading-2">서비스 문의</h2>
        <div class="inquiry-info">
          <a class="btn-xxlg btn-tertiary" href="/src/proposal.pdf" download="위블비즈 상품제안서">
            <i class="ic download"></i><span>상품제안서 다운로드</span>
          </a>
          <a class="btn-xxlg btn-tertiary" href="#">
            <i class="ic write"></i>
            <span>상담문의 등록하기</span>
          </a>
          <a class="btn-xxlg btn-tertiary" href="https://pf.kakao.com/_xfLxjdb" target="_blank" rel="noreferrer">
            <i class="ic talk"></i>
            <span>카톡으로 문의하기<em>ID: Wible Biz(위블 비즈)</em></span>
          </a>
        </div>

        <!-- 이용 프로세스 안내 -->
        <h2 class="heading-2">이용 프로세스 안내</h2>
        <ol class="process-info">
          <li><i class="ic process-1"></i><span><strong>문의 등록</strong><em>상담 문의를 등록해 주시면, 담당자가 맞춤형 상담을
                제공합니다.</em></span></li>
          <li><i class="ic process-2"></i><span><strong>관리자 설정</strong><em>관리자 Web 접속 후 결제방식 및 회사정보를 설정합니다.</em></span>
          </li>
          <li><i class="ic process-3"></i><span><strong>임직원 가입</strong><em>사용자 App에서 회원가입 후 소속 회사 인증을 진행합니다.</em></span>
          </li>
          <li><i class="ic process-4"></i><span><strong>서비스 이용</strong><em>사용자 App에서 차량 예약을 하고 위블존에서 바로
                이용하세요!</em></span></li>
        </ol>

        <!-- 다이얼로그 -->
        <dialog ref="dialogRef" class="dialog-wrapper dialog-error">
          <div class="dialog-body" style="margin-top: 35px;">
            <p class="message">검색어는 2글자 이상 입력해주세요.</p>
            <div class="button-group">
              <button type="button" class="btn-xlg btn-tertiary" ref="closeBtn" @click="closeDialog">확인</button>
            </div>
          </div>
        </dialog>

      </div> <!-- content -->
    </div><!-- container -->

    <!-- 퀵 유틸 -->
    <div class="quick-util active">
      <div class="inner">
        <button type="button" class="top" data-ui-click="scroll-top" @click="scrollToTop()">상단으로</button>
      </div>
    </div>

    <!-- Footer -->
    <Footer></Footer>

  </div><!-- wrapper -->
</template>

<script>
import Header from '/src/Components/Header.vue';
import Footer from '../components/Footer.vue';

export default {
  name: "Home",
  data() {
    return {
      selectTab: "CONSULT", // tab CONSULT(서비스 도입), USAGE(서비스 사용)
      selectedCategoryId: null, // 현재 선택된 서브 카테고리 id
      selectedCategoryName: null, // 현재 선택된 서브 카테고리 name

      categoryConsultOrigin: [], // 카테고리 origin data CONSULT
      categoryUsageOrigin: [], // 카테고리 origin data USAGE
      categoryOutput: [], // 화면에 표시할 카테고리 데이터

      feqConsultOrigin: {}, // feq origin data CONSULT
      feqUsageOrigin: [], // feq origin data USAGE
      feqOutput: [], // 화면에 표시할 내용 데이터
      searchKeyword: "", // 검색 키워드
      searchKeywordOutput: "", // 검색 키워드 출력
      isDialogOpen: false, // 다이얼로그의 열림 상태를 관리하는 값

      activeIndex: null, // 현재 활성화된 항목의 인덱스
      ingIndex: null, // ing 클래스가 적용될 항목의 인덱스
      preIngIndex: null, // 이전 ing 클래스가 적용될 항목의 인덱스
      showIndex: null, // show 클래스가 적용될 항목의 인덱스
      isAnimating: false, // 애니메이션 중인지 여부

    };
  },
  components: {
    Header,
    Footer,
  },
  watch: {

    // 탭 값 변경시
    selectTab(newTab) {

      console.log("tab click");
      this.categoryOutput =
        newTab === "CONSULT"
          ? this.categoryConsultOrigin
          : this.categoryUsageOrigin;

      // Proxy 객체를 JSON으로 변환
      console.log('선택한 탭 : ' + newTab);
      // var jsonObject = null;
      // if (newTab === "CONSULT") {
      //   jsonObject = JSON.parse(JSON.stringify(this.feqConsultOrigin));
      // } else {
      //   jsonObject = JSON.parse(JSON.stringify(this.feqUsageOrigin));
      // }
      // console.log(JSON.stringify(jsonObject.items, null, 4));

      // 탭 전환 시 데이터 초기화
      this.initData();
    },

    // 카테고리 값 변경 시
    selectedCategoryId(newId) {
      if (newId == null) { //카테고리 값 초기화되면 전체 선택
        const allCategoryInput = document.querySelector('.allCategoryInput');
        if (allCategoryInput) {
          allCategoryInput.checked = true;
        }
      }
    },

    // 검색어 값 변경 시
    searchKeywordOutput(newVal) {
      if (newVal === "") {
        this.searchKeyword = "";
        this.searchKeywordOutput = "";
      }
    }
  },
  computed: {
    // 화면에 표시할 FAQ 데이터
    displayedFAQs() {
      const originData =
        this.selectTab === "CONSULT"
          ? this.feqConsultOrigin
          : this.feqUsageOrigin;

      //데이터 값이 있을때만 필터
      if (originData.items && originData.items.length > 0) {
        //ouput data copy
        var filterOuputData = originData.items ? originData.items.slice() : null;

        //카테고리 필터
        if (this.selectedCategoryId != null) {
          console.log(this.selectedCategoryName);
          filterOuputData = filterOuputData
            .filter(item => item.subCategoryName && (item.categoryName.includes(this.selectedCategoryName) || item.subCategoryName.includes(this.selectedCategoryName)));
          console.log(filterOuputData);
        }

        //검색 키워드 필터
        if (this.searchKeyword) {

          //검색어 필터
          filterOuputData = filterOuputData
            .filter(item => item.answer && item.answer.includes(this.searchKeyword));
          console.log(filterOuputData);
        }

        const ouputData = {
          "items": filterOuputData
        };

        return ouputData;
      }//필터      

      return originData;
    },
  },
  methods: {

    //상단으로 스크롤
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 부드럽게 스크롤
      });
    },

    //다이얼로그 열기/닫기
    openDialog() {
      this.isDialogOpen = true;
      this.$refs.dialogRef.showModal(); // showModal() 호출
      this.$refs.closeBtn.focus(); // 다이얼로그 내부의 버튼에 포커스 이동
    },
    closeDialog() {
      setTimeout(() => {
        this.isDialogOpen = false;
      }, 300);
      this.$refs.dialogRef.close(); // close() 호출
    },

    // TOP 스크롤 이벤트
    handleScroll() {
      const stickyChecker = document.querySelector('.sticky-checker');
      const quickUtilEl = document.querySelector('.quick-util');
      
      if (window.scrollY > 0) {
        if (!stickyChecker.classList.contains('is-pinned')) {
          stickyChecker.classList.add('is-pinned');
        }
        if (!quickUtilEl.classList.contains('active')) {
          quickUtilEl.classList.add('active');
        }
      } else {
        if (stickyChecker.classList.contains('is-pinned')) {
          stickyChecker.classList.remove('is-pinned');
        }
        if (quickUtilEl.classList.contains('active')) {
          quickUtilEl.classList.remove('active');
        }
      }
    },

    //검색어 초기화
    clearInput() {
      this.searchKeywordOutput = '';
    },

    //카테고리 데이터 가져오기
    async fetchCategory(tab) {
      try {
        const fetchUrl = "/category?tab=" + tab;
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const data = await response.json();
          console.log("get category " + tab + " Data : " + JSON.stringify(data, null, 4));

          if (tab === "CONSULT") {
            this.categoryConsultOrigin = data;
          } else if (tab === "USAGE") {
            this.categoryUsageOrigin = data;
          }
          if (this.selectTab === tab) {
            this.categoryOutput = data;
            this.selectedCategoryId = null;
          }
        } else {
          console.error("Failed to fetch category:", response);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    },

    //FAQ 데이터 가져오기
    async fetchFeq(tab) {
      try {
        const fetchUrl = "/feq?tab=" + tab;
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const data = await response.json();
          console.log("get feq " + tab + " Data : " + JSON.stringify(data, null, 4));
          if (tab === "CONSULT") {
            this.feqConsultOrigin = data;
          } else if (tab === "USAGE") {
            this.feqUsageOrigin = data;
          }

          //기본 탭에 데이터 셋팅
          if (this.selectTab === tab) {
            this.displayedFAQs = data;
            console.log(this.displayedFAQs);
          }

        } else {
          console.error("Failed to fetch category:", response);
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    },

    initData() {
      //데이터 초기화
      this.activeIndex = null;
      this.ingIndex = null;
      this.preIngIndex = null;
      this.showIndex = null;
      this.isAnimating = false;
      this.selectedCategoryId = null;
      this.selectedCategoryName = null;
      this.searchKeyword = "";
      this.searchKeywordOutput = "";

      console.log('initData 호출됨: selectedCategoryId와 selectedCategoryName 초기화됨');
    },

    //tab 클릭
    setTab(str) {
      this.selectTab = str;
    },

    //카테고리 선택
    selectSubCategory(categoryId, name) {
      this.activeIndex = null;
      this.ingIndex = null;
      this.preIngIndex = null;
      this.showIndex = null;
      this.isAnimating = false;
      this.searchKeywordOutput = "";

      this.selectedCategoryId = categoryId;
      this.selectedCategoryName = name;
      console.log(categoryId + " " + name);
    },

    //Q&A 토글
    toggleItem(index) {

      if (this.isAnimating) return; // 애니메이션 중 클릭 방지

      const contentElements = this.$refs.faqContents;
      if (!contentElements || !contentElements[index]) {
        console.warn("FAQ 콘텐츠를 찾을 수 없습니다.");
        return;
      }

      this.isAnimating = true; // 애니메이션 시작
      const currentContent = contentElements[index];

      if (this.activeIndex === index) {
        // 닫기 동작
        this.showIndex = null; // show 클래스 제거
        this.ingIndex = index; // ing 클래스 추가
        this.activeIndex = null; // active 클래스 제거

        currentContent.style.height = `${currentContent.scrollHeight}px`; // 현재 높이 설정
        currentContent.style.height = "0"; // 높이를 0으로 설정
        setTimeout(() => {
          this.ingIndex = null; // ing 클래스 제거

          this.isAnimating = false;

        }, 600); // 애니메이션 시간 이후 제거
      } else {

        // 기존 열려 있는 항목 닫기
        if (this.activeIndex !== null) {
          const previousContent = contentElements[this.activeIndex];

          this.preIngIndex = this.activeIndex;
          this.showIndex = null; // show 클래스 제거
          previousContent.style.height = "0"; // 이전 항목 높이 0 설정
          setTimeout(() => {
            this.preIngIndex = null; // 이전 항목 ing 클래스 제거
          }, 600);
        }

        // 새로운 항목 열기
        this.ingIndex = index; // ing 클래스 추가
        this.activeIndex = index; // active 클래스 추가
        currentContent.style.height = "0"; // 초기 높이 설정
        setTimeout(() => {
          currentContent.style.height = `${currentContent.scrollHeight}px`; // 높이 설정
        }, 0);
        setTimeout(() => {
          this.ingIndex = null; // ing 클래스 제거
          this.showIndex = index; // show 클래스 추가

          this.isAnimating = false;
        }, 600); // 애니메이션 시간 이후 show 추가
      }

    },

    //엔터키 이벤트
    handleEnter(event) {
      event.preventDefault(); // 기본 동작 방지
      if(!this.isDialogOpen)
      {
        this.searchClick(); // 검색 함수 호출
      }
    },

    //검색어 클릭
    searchClick() {
      if (this.searchKeywordOutput.length < 2) {
        this.openDialog();
        return;
      }
      this.searchKeyword = this.searchKeywordOutput;
    },

  },
  mounted() {

    //스크롤 이벤트
    window.addEventListener('scroll', this.handleScroll);

    //초기 데이터 가져오기
    this.fetchCategory("CONSULT");
    this.fetchCategory("USAGE");
    this.fetchFeq("CONSULT");
    this.fetchFeq("USAGE");

  },
};
</script>

<style scoped>

</style>
