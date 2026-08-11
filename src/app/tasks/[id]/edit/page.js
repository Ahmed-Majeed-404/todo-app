import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import { getTask } from '@/lib/tasks';
import { updateTask } from '@/lib/actions';
import TaskForm from '@/components/TaskForm';

export const dynamic = 'force-dynamic';

export default async function EditTask({ params }) {
  const { id } = await params;
  const task = getTask(db, id);


  if (!task) notFound();

  return (
    <main className="mx-auto max-w-xl p-8">
      <Link href="/" className="text-sm underline">Back</Link>
      <h1 className="mb-6 mt-4 text-xl font-semibold">Edit task</h1>
      <TaskForm
        action={updateTask.bind(null, task.id)}
        task={task}
        submitLabel="Save changes"
      />
    </main>
  );
}