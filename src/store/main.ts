import { defineStore } from "pinia";
import type { Task, Label, Priority } from '@/utils/types';


type StoreState = {
  tasks: Task[],
  labels: Label[],
  activeLabel: 'all' | 'noLabel' | number,
}

export const useMainStore = defineStore('Main', {
  state: () => ({
    tasks: [],
    labels: [],
    activeLabel: 'all',
  } as StoreState),
  getters: {
    getTask: (state) => {
      return (taskId: number): Task => state.tasks.find(task => task.id === taskId)!;
    },
    activeTasks: (state) => {
      let tasks: Task[];
      if(state.activeLabel === 'all') {
        tasks = state.tasks;
      } else if (state.activeLabel === 'noLabel') {
        tasks = state.tasks.filter(task => task.labels.length === 0);
      } else {
        tasks = state.tasks.filter(task => task.labels.some(label => label.id === state.activeLabel));
      }

      tasks = [...tasks].sort((a, b) => priorityToNumber(a.priority) - priorityToNumber(b.priority));

      return tasks;
    },
    uncheckedTasks: (state) => {
      return state.tasks.filter(task => !task.completed).length;
    },
  },
});

const priorityToNumber = (priority: Priority) => priority === 'high' ? 0 : priority === 'medium' ? 1 : 2;
