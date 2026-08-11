import Link from 'next/link';
import db from '@/lib/db';
import { listArchived } from '@/lib/tasks';
import { restoreTask } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default function Archive() {
  const tasks = listArchived(db);

  return (
    <main className="mx-auto max-w-xl p-8">
      <Link href="/" className="text-sm underline">Back</Link>
      <h1 className="mb-6 mt-4 text-xl font-semibold">Archive</h1>

      {tasks.length === 0 && <p className="opacity-60">Nothing archived yet.</p>}

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
                  {task.topic && <span>{task.topic} · </span>}
                  Archived {task.archived_at}
                </p>
              </div>
              <form action={restoreTask.bind(null, task.id)} className="shrink-0">
                <button className="text-sm underline">Restore</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}