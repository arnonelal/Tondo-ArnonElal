import { storeToRefs } from "pinia";
import { watch, type Ref } from "vue";
import { useMainStore } from "@/store/main";
import type { Label, Priority, Task } from "./types";


const storageName = 'todolist_arnonelal';

export class TasksManager {

  private tasks: Ref<Task[]>;
  private labels: Ref<Label[]>;

  constructor() {
    const store = useMainStore();
    const { tasks, labels } = storeToRefs(store);
    this.tasks = tasks;
    this.labels = labels;

    watch([tasks, labels], () => {
      this.saveDataToLocalStorage();
    }, { deep: true });

    const storageData = this.importDataFromLocalStorage();
    if (storageData === null) {
      this.createExampleStore();
    } else {
      this.tasks.value = storageData[0];
      this.labels.value = storageData[1];
    }
  }

  addTask(taskData: { title: string, desc?: string, labels?: string[], priority: Priority}) {

    const id = this.getNextTaskId();
    const labels = taskData.labels === undefined ? [] : this.updateLabelsForTask(id, taskData.labels);

    this.tasks.value.push({
      id: id,
      title: taskData.title,
      desc: taskData.desc ?? null,
      labels: labels,
      completed: false,
      priority: taskData.priority,
    });
  }

  editTask(taskId: number, taskData: { title: string, desc?: string, labels?: string[], priority: Priority}) {
    const task = this.getTask(taskId);
    const labels = taskData.labels === undefined ? [] : this.updateLabelsForTask(taskId, taskData.labels);

    task.title = taskData.title;
    task.desc = taskData.desc ?? null;
    task.labels = labels;
    task.priority = taskData.priority;

    this.updateLabelsForEditedTask(taskId);
  }

  toggleCompleteTask(taskId: number, isCompleted: boolean) {
    const task = this.getTask(taskId);
    task.completed = isCompleted;
  }

  deleteTask(taskId: number) {
    const index = this.tasks.value.findIndex(task => task.id === taskId);
    if (index === -1) throw new Error();
    this.tasks.value.splice(index, 1);
    this.updateLabelsForRemovedTask(taskId);
  }

  deleteCompletedTasks() {
    this.tasks.value.filter(task => task.completed).forEach(task => this.deleteTask(task.id));
  }


  private createExampleStore() {
    this.addTask({ title: 'Buy milk', labels: ['home', 'shopping'], priority: 'high'});
    this.addTask({ title: 'Copy documents', desc: 'at Google Drive', labels: ['home'], priority: 'high' });
    this.addTask({ title: 'Repaint desk', priority: 'low' });
    this.addTask({ title: 'Upload repo to github', labels: ['work'], priority: 'medium' });
    this.addTask({ title: 'Talk with Tali about upcoming meeting', desc: '054-5645271', labels: ['work'], priority: 'medium' });
    this.toggleCompleteTask(0, true);
  }

  //updates labels and returns the labels as Label[]
  private updateLabelsForTask(taskId: number, labelNames: string[]): Label[] {
    //adds taskId to existing labels
    for (const label of this.labels.value) {
      if (!labelNames.includes(label.name)) continue;
      if (!label.taskIds.includes(taskId)) {
        label.taskIds.push(taskId);
      }
    }
    //create new labels 
    const allCurrentLabelNames = this.labels.value.map(label => label.name);
    const newLabelNames = labelNames.filter(label => !allCurrentLabelNames.some(existing => existing === label));
    let id = this.getNextLabelId();
    newLabelNames.forEach(newLabel => {
      this.labels.value.push({ id: id, name: newLabel, taskIds: [taskId] });
      id++;
    });

    return this.labels.value.filter(label => labelNames.some(label0 => label.name === label0));
  }

  private updateLabelsForRemovedTask(taskId: number) {
    let i = 0;
    while (i < this.labels.value.length) {
      const label = this.labels.value[i];
      label.taskIds = label.taskIds.filter(taskId0 => taskId0 !== taskId);
      if (label.taskIds.length === 0) {
        this.labels.value.splice(i, 1);
        continue;
      }
      i++;
    }
  }

  private updateLabelsForEditedTask(taskId: number) {
    const taskLabels = this.getTask(taskId).labels;

    let i = 0;
    while (i < this.labels.value.length) {
      const label = this.labels.value[i];
      if (label.taskIds.includes(taskId) && !taskLabels.includes(label)) {
        label.taskIds = label.taskIds.filter(taskId0 => taskId0 !== taskId);
      }

      if (label.taskIds.length === 0) {
        this.labels.value.splice(i, 1);
        continue;
      }
      i++;
    }
  }

  private getNextLabelId(): number {
    return this.labels.value.length === 0 ? 0 : (this.labels.value[this.labels.value.length - 1].id + 1);
  }

  private getNextTaskId(): number {
    return this.tasks.value.length === 0 ? 0 : (this.tasks.value[this.tasks.value.length - 1].id + 1);
  }

  private getTask(taskId: number): Task {
    const task = this.tasks.value.find(task => task.id === taskId);
    if (task === undefined) throw new Error();
    return task;
  }

  private importDataFromLocalStorage(): [tasks: Task[], labels: Label[]] | null {
    const storage = localStorage.getItem(storageName);
    if (storage === null) return null;

    try {
      const data = JSON.parse(storage) as [tasks: Task[], labels: Label[]];
      return data;
    } catch (e) {
      return null;
    }
  }

  private saveDataToLocalStorage() {
    const tasks = this.tasks.value;
    const labels = this.labels.value;

    const storage = JSON.stringify([tasks, labels]);
    localStorage.setItem(storageName, storage);
  }

}


export const tasksManager: {val: TasksManager} = {val: undefined as unknown as TasksManager} //will be initialied on App.vue