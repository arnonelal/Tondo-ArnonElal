
<script setup lang="ts">
import TaskItem from './TaskItem.vue';
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/main';


const store = useMainStore();
const { activeTasks } = storeToRefs(store);

</script>


<template>
  <div style="flex: 1;">
    <div class="container">
      <div v-for="(task, index) in activeTasks" :key="task.id">
        <TaskItem :task-data="task" />
        <div class="seperator" v-if="index !== activeTasks.length - 1"/>
      </div>
      <div class="placeholder" v-if="activeTasks.length === 0">No tasks yet...</div>
    </div>
  </div>

</template>

<style scoped>
.container {
  align-items: stretch;
  flex: 1;
  padding: 40px 10vw;
  overflow: auto;
}

.seperator {
    margin: 10px 0;
  height: 1px;
  background-color: #B7B7B7;
}

.placeholder {
  color: #6d6d6d;
  align-items: center;
}
</style>
