import Link from 'next/link';
import db from '@/lib/db';
import { createTask, archiveTask } from '@/lib/actions';
import TaskForm from '@/components/TaskForm';

export const dynamic = 'force-dynamic';

export default function Home() {
  const tasks = db.prepare(`
    SELECT * FROM tasks WHERE archived_at IS NULL
    ORDER BY due_date IS NULL, due_date, id DESC
  `).all();

  return (
    <main className="mx-auto max-w-xl p-8">
      <div className="mb-6 flex justify-between">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <Link href="/archive" className="underline">Archive</Link>
      </div>

      <TaskForm action={createTask} submitLabel="Add task" />

      <ul className="mt-8 space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4">
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium">{task.title}</p>
                {task.description && (
                  <p className="mt-1 text-sm opacity-70">{task.description}</p>
                )}
                <p className="mt-2 text-xs opacity-60">
                  {task.topic && <span>{task.topic}</span>}
                  {task.topic && task.due_date && <span> · </span>}
                  {task.due_date && <span>Due {task.due_date}</span>}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 text-sm">
                <Link href={`/tasks/${task.id}/edit`} className="underline">Edit</Link>
                <form action={archiveTask.bind(null, task.id)}>
                  <button className="underline">Archive</button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}