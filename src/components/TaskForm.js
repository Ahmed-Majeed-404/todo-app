export default function TaskForm({ action, task = {}, submitLabel = 'Save' }) {
  return (
    <form action={action} className="space-y-2">
      <input
        name="title" required placeholder="Title"
        defaultValue={task.title ?? ''}
        className="w-full border px-3 py-2"
      />
      <textarea
        name="description" rows={3} placeholder="Description"
        defaultValue={task.description ?? ''}
        className="w-full border px-3 py-2"
      />
      <div className="flex gap-2">
        <input
          type="date" name="due_date"
          defaultValue={task.due_date ?? ''}
          className="border px-3 py-2"
        />
        <input
          name="topic" placeholder="Topic"
          defaultValue={task.topic ?? ''}
          className="flex-1 border px-3 py-2"
        />
      </div>
      <button className="border px-4 py-2">{submitLabel}</button>
    </form>
  );
}