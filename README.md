# Next Play Games - Kanban Board Assessment

This project is a fully-functional, beautifully designed Kanban-style task board developed as a full-stack assessment submission. It utilizes modern web technologies to deliver a polished, responsive drag-and-drop experience.

**🔗 [Live Demo on Vercel](https://next-play-alpha.vercel.app)**

## 🚀 Tech Stack
- **Frontend Framework:** Next.js 14+ (App Router) & React
- **Language:** TypeScript
- **Styling:** Vanilla CSS Modules (custom Design System)
- **Drag & Drop Engine:** `@dnd-kit/core`
- **Backend & Database:** Supabase
- **Deployment:** Vercel

---

## ⭐️ Key Features

### Core Requirements Fully Implemented:
1. **Interactive Kanban Board:** 4 strict tracking columns (`To Do`, `In Progress`, `In Review`, `Done`).
2. **Real-time Drag and Drop:** Optimistic UI updates with `@dnd-kit` ensuring instantly satisfying interactions with snap-to-grid dropping.
3. **Automated Guest Sessions:** Utilizes Supabase Anonymous Authentication to instantly create a silent user session up on launch, guaranteeing zero login friction.
4. **Row Level Security (RLS):** Database transactions are tightly restricted. User A strictly cannot view or mutate User B's tasks.

### 🏆 Advanced "Stand Out" Features Completed:
- **Task Detail Modals:** Click securely into any task to view an expanded description layout.
- **Task Deletion Hooks:** Fully working destroy hooks from the detail pages.
- **Due Date Integrations:** Users can optionally flag explicit Due Dates upon creation. Cards intelligently parse these dates—triggering red "Overdue" indicators directly on the Kanban blocks if the date slips.
- **Priority Indicators:** Dynamic color-coded priority badges (`High`, `Normal`, `Low`).

---

## 🛠 Database Schema
The Supabase PostgreSQL database uses the following standard configuration. 

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

-- RLS Policies strictly enforce (auth.uid() = user_id) for SELECT, INSERT, UPDATE, DELETE requests.
```

---

## 💻 Local Developer Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kalyanmantha-ui/next-play.git
   cd next-play
   ```
2. **Install all dependencies:**
   ```bash
   npm install
   ```
3. **Setup environment variables:**
   Create a `.env.local` file in the root directory and map connecting securely to your designated Supabase backend:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.*
