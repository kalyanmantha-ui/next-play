'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/task';
import { Calendar } from 'lucide-react';
import styles from './Board.module.css';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, isOverlay, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  let className = styles.taskCard;
  if (isDragging) {
    className = `${styles.taskCard} ${styles.taskCardDragging}`;
  }
  if (isOverlay) {
    className = `${styles.taskCard} ${styles.taskCardOverlay}`;
  }


  const isOverdue = task.due_date && new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
      onClick={() => {
        if (!isDragging && onClick) onClick(task);
      }}
    >
      <div 
        {...attributes} 
        {...listeners}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', outline: 'none' }}
      >
        <div className={styles.taskTitle}>{task.title}</div>
        {task.description && (
          <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem', lineHeight: 1.4 }}>
            {task.description.length > 50 ? `${task.description.substring(0, 50)}...` : task.description}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className={`${styles.taskPriority} ${styles[`priority-${task.priority}`]}`}>
            {task.priority}
          </div>
          
          {task.due_date && (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', 
              color: isOverdue ? '#DC2626' : '#6B7280',
              fontWeight: isOverdue ? 600 : 400
            }}>
              <Calendar size={14} />
              <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
