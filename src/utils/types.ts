
export type Task = {
  id: number;
  title: string;
  desc: string | null;
  labels: Label[];
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export type Label = {
  id: number;
  name: string;
  taskIds: number[];
}

export type Priority = 'low' | 'medium' | 'high';