<template>
  <div>
    <h1>Todo List</h1>
    <ul>
      <li v-for="todo in todos" :key="todo.id">{{ todo.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      todos: [], // 할 일 목록
    };
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await fetch('/todos');
        if (response.ok) {
          const data = await response.json(); // 응답 데이터를 JSON으로 변환
          this.todos = data; // 할 일 목록 저장
        } else {
          console.error('Failed to fetch todos:', response);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    },
  },
  mounted() {
    this.fetchTodos(); // 컴포넌트가 마운트될 때 데이터 가져오기
  },
};
</script>
