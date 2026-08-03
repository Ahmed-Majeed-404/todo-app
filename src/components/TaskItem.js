"use client";

import { toggleTaskAction, archiveTaskAction } from "@/app/actions";

export default function TaskItem({ task }) {
  return (
    <li className="flex gap-3 rounded-lg border border-neutral-200 p-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskAction(task.id)}
        className="mt-1 h-4 w-4 shrink-0"
      />

      <div className="min-w-0 flex-1">
        <p
          className={
            task.completed
              ? "text-sm line-through text-neutral-400"
              : "text-sm font-medium"
          }
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-1 text-sm text-neutral-600">{task.description}</p>
        )}

        <div className="mt-2 flex gap-3 text-xs text-neutral-500">
          {task.topic && <span>{task.topic}</span>}
          {task.due_date && <span>Due {task.due_date}</span>}
        </div>
      </div>

      <button
        onClick={() => archiveTaskAction(task.id)}
        className="shrink-0 self-start text-xs text-neutral-500 hover:text-neutral-900"
      >
        Archive
      </button>
    </li>
  );
}