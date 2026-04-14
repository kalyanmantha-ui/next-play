import { supabase } from './supabase';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  return data as Task[];
};

export const createTask = async (task: CreateTaskInput, userId: string): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...task, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }
  return data as Task;
};

export const updateTaskStatus = async (id: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

export const updateTaskField = async (id: string, updates: UpdateTaskInput): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};
