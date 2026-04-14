# Kanban Board Assessment

This is an implementation of a Kanban-style task board built for a full-stack assessment. 

Live Demo: [https://next-play-alpha.vercel.app](https://next-play-alpha.vercel.app)

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- CSS Modules
- @dnd-kit/core for drag and drop
- Supabase for backend and authentication
- Vercel for hosting

## Database Schema
The Supabase PostgreSQL database uses the following configuration along with Row Level Security (RLS) to ensure users can only access their own data.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'in_review', 'done')),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    description TEXT,
    priority TEXT CHECK (priority IN ('low', 'normal', 'high')),
    due_date DATE,
    labels TEXT[],
    assignee_id UUID
);
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/kalyanmantha-ui/next-play.git
   cd next-play
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features Implemented
- Kanban board with To Do, In Progress, In Review, and Done columns.
- Supabase Anonymous Authentication for guest sessions.
- Task creation with title, description, priority, and due date.
- Drag and drop functionality to update task status.
- Task detail modal with descriptions and delete functionality.
- Due date indicators highlighting overdue tasks.
- Loading and error states handling in the UI.
