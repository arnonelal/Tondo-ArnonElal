import { defineStore } from "pinia";


type StoreState = {
  isPopupVisible: boolean;
  mode: 'create' | 'edit';
  taskIdForEdit: number | null;
}

export const useTaskPopupStore = defineStore('TaskPopup', {
  state: () => ({
    isPopupVisible: false,
    mode: 'create',
    taskIdForEdit: null,
  } as StoreState),
  actions: {
    showPopupForCreate() {
      this.isPopupVisible = true;
      this.mode = 'create';
      this.taskIdForEdit = null;
    },
    showPopupForEdit(taskId: number) {
      this.isPopupVisible = true;
      this.mode = 'edit';
      this.taskIdForEdit = taskId;
    },
    hidePopup() {
      this.isPopupVisible = false;
      this.mode = 'create';
      this.taskIdForEdit = null;
    }
  },
})
