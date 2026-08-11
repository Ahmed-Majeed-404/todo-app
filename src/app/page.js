import Link from 'next/link';
import db from '@/lib/db';
import { createTask, archiveTask, setStatus } from '@/lib/actions';
import { SORTS, SORT_LABELS, DEFAULT_SORT } from '@/lib/sorts';
import { STATUSES } from '@/lib/statuses';
import { isOverdue } from '@/lib/dates';
import TaskForm from '@/components/TaskForm';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const { sort = DEFAULT_SORT } = await searchParams;
  const orderBy = SORTS[sort] ?? SORTS[DEFAULT_SORT];

  const tasks = db.prepare(`
    SELECT * FROM tasks WHERE archived_at IS NULL ORDER BY ${orderBy}
  `).all();

  return (
    <main className="mx-auto max-w-xl p-8">
      <div className="mb-6 flex justify-between">
        <h1 className="text-xl font-semibold">Tasks</h1>
        <Link href="/archive" className="underline">Archive</Link>
      </div>

      <TaskForm action={createTask} submitLabel="Add task" />

      <div className="mb-4 mt-8 flex gap-3 text-sm">
        <span className="opacity-60">Sort:</span>
        {Object.keys(SORTS).map((key) => (
          <Link
            key={key}
            href={`/?sort=${key}`}
            className={sort === key ? 'font-medium underline' : 'opacity-60'}
          >
            {SORT_LABELS[key]}
          </Link>
        ))}
      </div>

      {tasks.length === 0 && <p className="opacity-60">No tasks yet.</p>}

      <ul className="space-y-4">
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
                  {isOverdue(task) && (
                    <span className="ml-2 rounded border border-red-600 px-1.5 py-0.5 font-medium text-red-600">
                      Overdue
                    </span>
                  )}
                </p>

                <div className="mt-3 flex gap-1 text-xs">
                  {STATUSES.map(({ value, label, idle, active }) => (
                    <form key={value} action={setStatus.bind(null, task.id, value)}>
                      <button
                        className={`rounded border px-2 py-1 ${
                          task.status === value ? active : idle
                        }`}
                      >
                        {label}
                      </button>
                    </form>
                  ))}
                </div>
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