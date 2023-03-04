<script setup lang="ts">
import type { Task as TaskData } from '@/utils/types';
import { ref } from 'vue';
import { tasksManager } from '@/utils/TasksManager';
import { getColorById } from '@/utils/labelColors';
import { useTaskPopupStore } from '@/store/taskPopup';


defineProps<{
  taskData: TaskData,
}>();

const { showPopupForEdit } = useTaskPopupStore();
const isHovering = ref(false);

</script>


<template>
    <div class="container-taskItem"
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <button class="taskButton" @click="tasksManager.val.toggleCompleteTask(taskData.id, !taskData.completed)">
        <span class="taskCircle" :priority="taskData.priority"/>
        <span v-if="taskData.completed" class="taskCheckmark">✔</span>
      </button>
      <div style="flex-grow: 1;">
        <span class="title" :class="{titleChecked: taskData.completed}">
          {{ taskData.title }}
        </span>
        <span class="description">
          {{ taskData.desc }}
        </span>
        <div style="flex-flow: row;">
          <span class="label"
            v-for="label in taskData.labels" :key="label.id"
            :style="`color: ${getColorById(label.id)};`"
          >
            <span class="labelCircle" :style="`background-color: ${getColorById(label.id)};`"/>
            {{ label.name }}
          </span>
        </div>
      </div>
      <div v-if="isHovering" style="flex-flow: row;">
        <button class="actionButton" @click="showPopupForEdit(taskData.id)">
          <img class="actionButtonIcon" src="@/assets/icons/edit.png">
        </button>
        <button class="actionButton" @click="tasksManager.val.deleteTask(taskData.id)">
          <img class="actionButtonIcon" src="@/assets/icons/delete.png">
        </button>
      </div>
    </div>
</template>

<style scoped>
.container-taskItem {
  flex-flow: row;
  margin: 0 30px;
  align-items: center;

}

.taskButton {
  height: 25px;
  width: 25px;
  margin-right: 10px;
  position: relative;
}

.taskCircle {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border: 1px solid #a3a3a3;
  background-color: white;
  border-radius: 50%;
  position: absolute;
}

.taskCircle[priority='high'] {
  -webkit-box-shadow: 0px 0px 5px 0px #e63434;
  box-shadow: 0px 0px 5px 0px #e63434;
}
.taskCircle[priority='medium'] {
  -webkit-box-shadow: 0px 0px 5px 0px #e07f2a;
  box-shadow: 0px 0px 5px 0px #e07f2a;
}
.taskCircle[priority='low'] {
  -webkit-box-shadow: 0px 0px 5px 0px #e4b725;
  box-shadow: 0px 0px 5px 0px #e4b725;
}
.taskCheckmark {
  height: 100%;
  width: 100%;
  top: -16px;
  left: 3px;
  font-size: 33px;
  color: #515151;
  position: absolute;
}

.title {
  margin-top: 2px; 
  font-size: 18px;
}
.titleChecked {
  text-decoration: line-through;
  color: #7E7D7D;
}

.description {
  font-size: 14px;
  color: #7E7D7D;
}

.label {
  font-size: 12px;
  flex-flow: row;
  margin-right: 8px;
  margin-top: 4px;
  justify-content: center;
}
.labelCircle {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin-right: 3px;
  display: inline-block;
}

.actionButton {
  margin: 0 6px;
}

.actionButtonIcon {
  width: 15px;
  height: 15px;
}
</style>
