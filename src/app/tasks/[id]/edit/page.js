import { notFound } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';
import { updateTask } from '@/lib/actions';
import TaskForm from '@/components/TaskForm';

export const dynamic = 'force-dynamic';

export default async function EditTask({ params }) {
  const { id } = await params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) notFound();

  return (
    <main className="mx-auto max-w-xl p-8">
      <Link href="/" className="text-sm underline">Back</Link>
      <h1 className="mb-6 mt-4 text-xl font-semibold">Edit task</h1>
      <TaskForm action={updateTask.bind(null, task.id)} task={task} submitLabel="Save changes" />
    </main>
  );
}