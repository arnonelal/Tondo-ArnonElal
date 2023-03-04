<script setup lang="ts">
import { tasksManager } from '@/utils/TasksManager';
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store/main';
import { useTaskPopupStore } from '@/store/taskPopup';
import { getColorById } from '@/utils/labelColors';


const mainStore = useMainStore();
const { showPopupForCreate } = useTaskPopupStore();
const { activeLabel, labels, uncheckedTasks } = storeToRefs(mainStore);

</script>


<template>
  <div style="height: 100%;">
    <div class="container">
      <button primary @click="showPopupForCreate()">New Task</button>
      <button primary @click="tasksManager.val.deleteCompletedTasks()">Clear Completed</button>
      <div class="uncheckedTasks">Unchecked: {{uncheckedTasks}}</div>
      <div class="seperator"/>
      <button secondary
        :selected="activeLabel === 'all'"
        @click="activeLabel = 'all'"
      >Show All</button>
      <button secondary
        :selected="activeLabel === 'noLabel'"
        @click="activeLabel = 'noLabel'"
      >No Label</button>
      <div style="align-items: start; overflow: auto; direction: rtl;">
        <div style="direction: ltr;">
          <button secondary
            v-for="label in labels"
            :key="label.id"
            :selected="activeLabel === label.id"
            @click="activeLabel = label.id"
          >
            <span class="labelCircle" :style="`background-color: ${getColorById(label.id)};`"/>
            {{ label.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: #FA624D;
  align-items: center;
  padding: 20px;
  width: 180px;
  color: white;
  height: 100%;
}

button[primary] {
  padding: 10px 0;
  font-size: 20px;
}

button[secondary] {
  padding: 10px 0;
  font-size: 16px;
  align-items: center;
}

button[secondary][selected=true] {
  font-weight: bold;
}

.seperator {
  margin: 20px 0;
  width: 80%;
  height: 1px;
  background-color: #ffffff;
}

.labelCircle {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-right: 6px;
  display: inline-block;
}

.uncheckedTasks {
  padding-top: 12px;
  padding-bottom: 2px;
  font-size: 15px;
}
</style>
