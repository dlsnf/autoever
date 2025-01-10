<template>
  <div class="faq-container">
    <header>
      <h1>자주 묻는 질문</h1>
      <p>궁금하신 내용을 빠르게 찾아보세요.</p>
    </header>

    <div class="tabs">
      <button
        :class="{ active: selectTab === 'CONSULT' }"
        @click="setCategory('CONSULT')"
      >
        서비스 도입
      </button>
      <button
        :class="{ active: selectTab === 'USAGE' }"
        @click="setCategory('USAGE')"
      >
        서비스 사용
      </button>
    </div>

    <div class="search-bar">
      <input
        type="text"
        placeholder="찾으시는 내용을 입력해 주세요"
        v-model="searchKeyword"
      />
      <button>검색</button>
    </div>

    <!-- 카테고리 추가 -->
    <div class="category-tabs">
      <button
        :class="{ selected: selectedCategory === null && categoryOutput.length > 0}"
        @click="selectSubCategory(null)"
      >
        전체
      </button>
      <button
      v-for="(category, index) in categoryOutput"
      :key="index"
      :class="{ selected: selectedCategory === category.categoryID }"
      @click="selectSubCategory(category.categoryID)"
      >
      {{ category.name }}
      </button>
    </div>

    <div class="faq-list">
      <p v-if="!displayedFAQs && !displayedFAQs.items.length">No FAQs available</p>
      <ul>
        <li v-for="(item, index) in displayedFAQs.items" :key="index">
          <h3>{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </li>
      </ul>
    </div>

    <div class="service-inquiry">
      <button>상품제안서 다운로드</button>
      <button>상담문의 등록하기</button>
      <button>카톡으로 문의하기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      selectTab: "CONSULT", // tab CONSULT(서비스 도입), USAGE(서비스 사용)
      selectedCategory: null, // 현재 선택된 서브 카테고리

      categoryConsultOrigin: [], // 카테고리 origin data CONSULT
      categoryUsageOrigin: [], // 카테고리 origin data USAGE
      categoryOutput: [], // 화면에 표시할 카테고리 데이터

      feqConsultOrigin: {}, // feq origin data CONSULT
      feqUsageOrigin: [], // feq origin data USAGE
      feqOutput: [], // 화면에 표시할 내용 데이터
      searchKeyword: "", // 검색 키워드

    };
  },
  watch: {
    selectTab(newTab) {
      console.log("tab click");
      this.categoryOutput =
      newTab === "CONSULT"
          ? this.categoryConsultOrigin
          : this.categoryUsageOrigin;

      this.selectedCategory = this.categoryOutput.length
        ? this.categoryOutput[0].categoryID
        : null; // 기본 선택은 첫 번째 카테고리
      

      // Proxy 객체를 JSON으로 변환
      
      console.log('선택한 탭 : ' + newTab);
      if(newTab === "CONSULT"){
        var jsonObject = JSON.parse(JSON.stringify(this.feqConsultOrigin));
      }else{
        var jsonObject = JSON.parse(JSON.stringify(this.feqUsageOrigin));
      }
      // console.log(JSON.stringify(jsonObject.items,null,4));


      // 카테고리 전환 시 "전체" 선택 상태로 초기화
      this.selectedCategory = null;
    },
  },
  computed: {
    displayedFAQs() {
      const originData =
        this.selectTab === "CONSULT"
          ? this.feqConsultOrigin
          : this.feqUsageOrigin;

      if (this.searchKeyword) {
        return originData.filter((item) =>
          item.title.includes(this.searchKeyword)
        );
      }
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
          console.log("get category " + tab + " Data : " + JSON.stringify(data,null,4));

          if (tab === "CONSULT") {
            this.categoryConsultOrigin = data;
          } else if (tab === "USAGE") {
            this.categoryUsageOrigin = data;
          }
          if (this.selectTab === tab) {
            this.categoryOutput = data;
            this.selectedCategory = null;
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
          console.log("get feq " + tab + " Data : " + JSON.stringify(data,null,4));
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
    },
    //카테고리 선택
    selectSubCategory(categoryId) {
      this.selectedCategory = categoryId;
      console.log(categoryId);
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
</style>
