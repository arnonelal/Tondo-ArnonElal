<script setup lang="ts">
import MainToolbar from './components/AppToolbar.vue';
import TasksContainer from './components/TasksContainer.vue';
import TaskPopup from './components/TaskPopup.vue';
import { useTaskPopupStore } from '@/store/taskPopup';
import { TasksManager, tasksManager } from './utils/TasksManager';
import { storeToRefs } from 'pinia';


tasksManager.val = new TasksManager();
const { isPopupVisible } = storeToRefs(useTaskPopupStore());

</script>


<template>
  <TaskPopup v-if="isPopupVisible"/>
  <div class="mainFrame">
    <MainToolbar />
    <TasksContainer />
  </div>

</template>

<style scoped>
.mainFrame {
  width: 100vw;
  height: 100vh;
  flex-flow: row;
}
</style>
