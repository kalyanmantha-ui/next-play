'use client';

import React, { useState } from 'react';
import { Task } from '../types/task';
import { Calendar } from 'lucide-react';
import styles from './Board.module.css';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function TaskDetailsModal({ task, onClose, onDelete }: TaskDetailsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      onClose();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div className={styles.modalContent} onMouseDown={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '1.25rem', color: 'var(--foreground)' }}>{task.title}</h3>
          <button onClick={onClose} style={{ color: 'gray', fontSize: '1.2rem' }}>&times;</button>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'gray', marginBottom: '0.5rem', fontWeight: 500 }}>Description</div>
          <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', color: 'var(--foreground)', minHeight: '80px', border: '1px solid var(--border)', lineHeight: 1.5 }}>
            {task.description || <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No description provided.</span>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
             <div style={{ fontSize: '0.75rem', color: 'gray', marginBottom: '0.25rem' }}>Priority</div>
             <span className={`${styles.taskPriority} ${styles[`priority-${task.priority}`]}`}>
               {task.priority}
             </span>
          </div>
          {task.due_date && (
            <div>
               <div style={{ fontSize: '0.75rem', color: 'gray', marginBottom: '0.25rem' }}>Due</div>
               <div style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', 
                color: isOverdue ? '#DC2626' : '#4B5563', fontWeight: 500
               }}>
                 <Calendar size={16} />
                 {new Date(task.due_date).toLocaleDateString()}
                 {isOverdue && <span style={{ color: '#DC2626', fontSize: '0.75rem' }}>(Overdue)</span>}
               </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'gray' }}>
            Created: {new Date(task.created_at).toLocaleDateString()}
          </span>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            style={{ 
              background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', 
              borderRadius: 'var(--radius)', fontWeight: 500, opacity: isDeleting ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}>
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
