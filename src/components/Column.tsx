'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';
import styles from './Board.module.css';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function Column({ id, title, tasks, onTaskClick }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span>{title}</span>
        <span className={styles.columnBadge}>{tasks.length}</span>
      </div>
      
      <div ref={setNodeRef} className={styles.taskList}>
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
