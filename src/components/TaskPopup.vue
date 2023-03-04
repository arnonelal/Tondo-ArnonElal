<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useMainStore } from '@/store/main';
import { useTaskPopupStore } from '@/store/taskPopup';
import { tasksManager } from '@/utils/TasksManager';
import type { Priority } from '@/utils/types'; 


const { getTask } = useMainStore();
const { mode, taskIdForEdit, hidePopup } = useTaskPopupStore();

interface InputData {
  title: string,
  desc: string,
  labels: string,
  priority: Priority,
}

const inputData: InputData = reactive({
  title: '',
  desc: '',
  labels: '',
  priority: 'high',
});

onMounted(() => {
  if (taskIdForEdit !== null) {
    const taskData = getTask(taskIdForEdit);
    inputData.title = taskData.title;
    inputData.desc = taskData.desc ?? '';
    inputData.labels = taskData.labels.map(label => label.name).join(', ');
    inputData.priority = taskData.priority
  }
});

function approveTask() {
  const labels = inputData.labels.split(',').map(label => label.trim()).filter(label => label !== '');
  if (mode === 'edit') {
    tasksManager.val.editTask(taskIdForEdit!, {
      title: inputData.title,
      desc: inputData.desc,
      labels,
      priority: inputData.priority,
    });
  } else {
    tasksManager.val.addTask({
      title: inputData.title,
      desc: inputData.desc,
      labels,
      priority: inputData.priority,
    });
  }
  hidePopup();
}

</script>


<template>
  <div>
    <div class="container">
      <div class="popup">
        <div style="justify-content: stretch;">
          <input
            type="text"
            primary
            autofocus
            placeholder="TaskName"
            v-model="inputData.title"
          />
          <textarea
            rows="1"
            placeholder="Description"
            v-model="inputData.desc"
          />
          <input
            type="text"
            placeholder="Labels (seperated by commas)"
            v-model="inputData.labels"
          />
          <div style="flex-flow: row; margin-top: 6px;">
            <b style="margin-left: 3px;">Priority</b>
            <input type="radio" v-model="inputData.priority" value="high"/>High
            <input type="radio" v-model="inputData.priority" value="medium"/>Medium
            <input type="radio" v-model="inputData.priority" value="low"/>Low
          </div>
        </div>
        <div style="flex-flow: row; justify-content: center; padding-top: 10px;">
          <button @click="hidePopup()">Cancel</button>
          <button primary @click="approveTask()" :disabled="inputData.title === ''">
            {{mode === 'create' ? 'Add Task' : 'Save Task'}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #e0e0e06b;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.popup {
  background-color: #fefefe;
  padding: 40px;
  padding-bottom: 10px;
  filter: drop-shadow(13px 13px 16px rgba(0, 0, 0, 0.384));
}

input[type=text] {
  outline: none;
  font-size: 20px;
  margin-bottom: 10px;
  width: 500px;
  border: none;
  background: none;
}

input[type=text][primary] {
  font-weight: bold;
}

textarea {
  outline: none;
  font-size: 20px;
  margin-bottom: 10px;
  width: 500px;
  border: none;
  background: none;
  overflow: hidden;
}

input[type=radio] {
  margin-left: 7px;
}

button {
  padding: 10px 14px;
  margin: 10px;
  border-radius: 10px;
  font-weight: bold;
  background-color: #adadad;
  color: black;
}

button[primary] {
  background-color: #FA624D;
  color: white;
}
button:not([disabled]):hover {
  background-color: #8a8a8a;
}
button[primary]:not([disabled]):hover {
  background-color: #c94f3f;
}
button[disabled] {
  color: gray;
}

</style>
