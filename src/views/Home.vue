<template>
  <div class="wrapper">

    <Header></Header>


    <div class="container">
      <div class="content">


        <h1>자주 묻는 질문 <em>궁금하신 내용을 빠르게 찾아보세요.</em></h1>

        <ul class="tabs">
          <li :class="{ active: selectTab === 'CONSULT' }" @click="setCategory('CONSULT')"><a><span>서비스 도입</span></a>
          </li>
          <li :class="{ active: selectTab === 'USAGE' }" @click="setCategory('USAGE')"><a><span>서비스 이용</span></a></li>
        </ul>



        <div class="search-bar">
          <input type="text" placeholder="찾으시는 내용을 입력해 주세요" v-model="searchKeyword" />
          <button>검색</button>
        </div>

        <!-- 카테고리 추가 -->
        <div class="category-tabs">
          <button :class="{ selected: selectedCategoryId === null && categoryOutput.length > 0 }"
            @click="selectSubCategory(null, null)">
            전체
          </button>
          <button v-for="(category, index) in categoryOutput" :key="index"
            :class="{ selected: selectedCategoryId === category.categoryID }"
            @click="selectSubCategory(category.categoryID, category.name)">
            {{ category.name }}
          </button>
        </div>

        <!-- <div class="faq-list">
          <p v-if="displayedFAQs.items && displayedFAQs.items.length == 0">조회된 데이터가 없습니다.</p>
          <ul>
            <li v-for="(item, index) in displayedFAQs.items" :key="index">
              <h3>{{ item.question }}</h3>
              <p>{{ item.answer }}</p>
            </li>
          </ul>
        </div> -->


        <!-- FAQ 항목 -->
        <ul class="faq-list">
          <p v-if="displayedFAQs.items && displayedFAQs.items.length == 0">조회된 데이터가 없습니다.</p>

          <li data-ui-item="true" v-for="(item, index) in displayedFAQs.items" :key="index" :class="{ active: activeIndex === index, ing: ingIndex === index, ing2 : preIngIndex === index, show: showIndex === index }">
            <!-- Q&A 버튼 -->
            <h4 class="a">
              <button type="button" data-ui-click="dropdown-toggle" @click="toggleItem(index)"><em>{{ selectTab == "CONSULT" ? item.subCategoryName : item.categoryName }}</em><strong>{{item.question}}</strong></button>
            </h4>

            <!-- 답변 -->
            <div
        class="q"
        ref="faqContents"
      >
        <div class="inner" v-html="item.answer"></div>
      </div>


          </li>
        </ul>

        <div class="service-inquiry">
          <button>상품제안서 다운로드</button>
          <button>상담문의 등록하기</button>
          <button>카톡으로 문의하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Header from '/src/Components/Header.vue';


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

      activeIndex: null, // 현재 활성화된 항목의 인덱스
      ingIndex: null, // ing 클래스가 적용될 항목의 인덱스
      preIngIndex: null, // 이전 ing 클래스가 적용될 항목의 인덱스
      showIndex: null, // show 클래스가 적용될 항목의 인덱스
      isAnimating: false, // 애니메이션 중인지 여부

    };
  },
  components: {
    Header,
  },
  watch: {
    selectTab(newTab) {
      console.log("tab click");
      this.categoryOutput =
        newTab === "CONSULT"
          ? this.categoryConsultOrigin
          : this.categoryUsageOrigin;

      this.selectedCategoryId = this.categoryOutput.length
        ? this.categoryOutput[0].categoryID
        : null; // 기본 선택은 첫 번째 카테고리


      // Proxy 객체를 JSON으로 변환
      console.log('선택한 탭 : ' + newTab);
      var jsonObject = null;
      if (newTab === "CONSULT") {
        jsonObject = JSON.parse(JSON.stringify(this.feqConsultOrigin));
      } else {
        jsonObject = JSON.parse(JSON.stringify(this.feqUsageOrigin));
      }
      console.log(JSON.stringify(jsonObject.items, null, 4));


      // 카테고리 전환 시 "전체" 선택 상태로 초기화
      this.selectedCategoryId = null;
    },
  },
  computed: {
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

    //tab 클릭
    setCategory(str) {
      
      this.selectTab = str;

      //데이터 초기화
      this.activeIndex = null;
      this.ingIndex = null;
      this.preIngIndex = null;
      this.showIndex = null;
      this.isAnimating = false;

    },
    //카테고리 선택
    selectSubCategory(categoryId, name) {
      this.selectedCategoryId = categoryId;
      this.selectedCategoryName = name;
      console.log(categoryId + " " + name);
    },

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
  },
  mounted() {
    this.fetchCategory("CONSULT");
    this.fetchCategory("USAGE");
    this.fetchFeq("CONSULT");
    this.fetchFeq("USAGE");
  },
};
</script>

<style scoped></style>
