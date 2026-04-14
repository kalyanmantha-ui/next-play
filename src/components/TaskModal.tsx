'use client';

import React, { useState } from 'react';
import { CreateTaskInput, TaskPriority } from '../types/task';
import styles from './Board.module.css';

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (task: CreateTaskInput) => Promise<void>;
}

export function TaskModal({ onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        status: 'todo',
        due_date: dueDate || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div className={styles.modalContent} onMouseDown={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Create New Task</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'gray' }}>Title *</label>
            <input 
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
              value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Design Homepage"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'gray' }}>Description</label>
            <textarea 
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', minHeight: '80px' }}
              value={description} onChange={e => setDescription(e.target.value)} placeholder="Add more details..."
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'gray' }}>Priority</label>
              <select 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'gray' }}>Due Date</label>
              <input 
                type="date"
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
                value={dueDate} onChange={e => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', color: 'var(--foreground)' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ 
              background: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem', 
              borderRadius: 'var(--radius)', fontWeight: 500, opacity: loading ? 0.7 : 1 
            }}>
              {loading ? 'Saving...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
