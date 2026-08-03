import { getActiveTasks } from "@/lib/tasks";
import TaskForm from "@/components/TaskForm";
import TaskItem from "@/components/TaskItem";

export default function Home() {
  const tasks = getActiveTasks();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <a href="/archive" className="text-sm text-neutral-500 hover:text-neutral-900">
          Archive
        </a>
      </header>

      <TaskForm />

      <ul className="mt-8 space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      {tasks.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">
          No tasks yet. Add one above.
        </p>
      )}
    </main>
  );
}