export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  user_id: string;
  priority: TaskPriority;
  due_date?: string;
  labels?: string[];
  created_at: string;
  assignee_id?: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'user_id' | 'created_at'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;
