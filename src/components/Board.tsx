'use client';

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay
} from '@dnd-kit/core';
import { useAuth } from '../context/AuthContext';
import { fetchTasks, updateTaskStatus, createTask, deleteTask } from '../lib/api';
import { Task, TaskStatus, CreateTaskInput } from '../types/task';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { AlertCircle, Loader2 } from 'lucide-react';
import styles from './Board.module.css';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review', title: 'In Review' },
  { id: 'done', title: 'Done' }
];

export function Board() {
  const { session, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if (authLoading) return;
    if (session) {
      loadTasks();
    } else {
      setError("Waiting for Guest Authentication to initialize...");
      setLoading(false);
    }
  }, [session, authLoading]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load tasks. Database might be down or unconfigured.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskInput: CreateTaskInput) => {
    if (!session) return;
    try {
      const newTask = await createTask(taskInput, session.user.id);
      setTasks(prev => [newTask, ...prev]);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to create task.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to delete task.");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    
    let newStatus: TaskStatus | null = null;
    if (COLUMNS.some(c => c.id === overId)) {
      newStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (!newStatus) return;

    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;


    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as TaskStatus } : t));

    try {
      await updateTaskStatus(taskId, newStatus);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to update task status.");
      loadTasks();
    }
  };

  if (loading || authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'gray' }}>
        <Loader2 className={styles.spinner} size={32} />
        <div style={{ marginTop: '1rem' }}>Loading Board...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Next Play Games</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'gray' }}>
            Guest ID: {session?.user?.id?.substring(0, 8) || 'Unknown'}...
          </span>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            style={{ 
              background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', 
              borderRadius: 'var(--radius)', fontWeight: 500, transition: '0.2s',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            + New Task
          </button>
        </div>
      </header>

      {error && (
        <div style={{ background: '#FEF2F2', borderLeft: '4px solid #EF4444', color: '#B91C1C', padding: '1rem', margin: '1.5rem 2.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: 'var(--radius)' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.boardContainer}>
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter(t => t.status === col.id)}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {isCreateModalOpen && (
        <TaskModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateTask} />
      )}

      {selectedTask && (
        <TaskDetailsModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
