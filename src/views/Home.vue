<template>
  <div>
    <h1>Todo List</h1>
    <button @click="setCategory('CONSULT')">get Category CONSULT</button>
    <button @click="setCategory('USAGE')">get Category USAGE</button>
    <ul>
      <li v-for="category in categoryOrigin" :key="category.id">{{ category.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      selectCategory : "CONSULT", //CONSULT(서비스 도입), USAGE(서비스 사용)

      categoryConsultOrigin: [], // 카테고리 origin data CONSULT
      categoryUsageOrigin: [], // 카테고리 origin data USAGE
      categoryOutput: [], // 카테고리 Output data

      feqConsultOrigin : {}, // feq origin data CONSULT
      feqUsageOrigin : {}, // feq origin data USAGE
      feqOutput : {},
    };
  },
  methods: {
    async fetchCategory(tab) {
      try {
        const fetchUrl = "/category?tab=" + tab;
        // console.log("fetchUrl : " + fetchUrl);
        const response = await fetch(fetchUrl);
        if (response.ok) {

          const data = await response.json(); // 응답 데이터를 JSON으로 변환
          console.log("get category " + tab + " Data : " + JSON.stringify(data,null,4));

          if(tab === 'CONSULT'){
            this.categoryConsultOrigin = data; // set Data
          }else if(tab === 'USAGE'){
            this.categoryUsageOrigin = data;
          }
          
        } else {
          console.error('Failed to fetch category:', response);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    },

    async fetchFeq(tab) {
      try {
        const fetchUrl = "/feq?tab=" + tab;
        // console.log("fetchUrl : " + fetchUrl);
        const response = await fetch(fetchUrl);
        if (response.ok) {

          const data = await response.json(); // 응답 데이터를 JSON으로 변환
          console.log("get feq " + tab + " Data : " + JSON.stringify(data,null,4));

          if(tab === 'CONSULT'){
            this.feqConsultOrigin = data; // set Data
          }else if(tab === 'USAGE'){
            this.feqUsageOrigin = data;
          }

        } else {
          console.error('Failed to fetch category:', response);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    },

    setCategory(str){
      this.selectCategory = str;
    }
  },
  mounted() {
    // 컴포넌트가 마운트될 때 데이터 가져오기
    
    //카테고리 가져오기
    this.fetchCategory("CONSULT"); 
    this.fetchCategory("USAGE"); 

    //feq 가져오기
    this.fetchFeq("CONSULT");
    this.fetchFeq("USAGE");
  },
};
</script>
