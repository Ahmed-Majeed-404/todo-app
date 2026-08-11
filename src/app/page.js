import db from '@/lib/db';
import { addTask, toggleTask } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default function Home() {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY done, id DESC').all();

  return (
    <main className="mx-auto max-w-md p-8">
      <form action={addTask} className="flex gap-2">
        <input name="title" className="flex-1 border px-3 py-2" placeholder="New task" />
        <button className="border px-4 py-2">Add</button>
      </form>

      <ul className="mt-6 space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <form action={toggleTask.bind(null, task.id)}>
              <button className={task.done ? 'line-through opacity-50' : ''}>
                {task.title}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}