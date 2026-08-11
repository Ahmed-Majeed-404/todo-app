'use client';

import { useRef } from 'react';

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export default function TaskForm({ action, task = {}, submitLabel = 'Save' }) {
  const dateRef = useRef(null);

  function openPicker() {
    try {
      dateRef.current?.showPicker();
    } catch {
      dateRef.current?.focus();
    }
  }

  return (
    <form action={action} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          name="title" required placeholder="What needs doing?"
          defaultValue={task.title ?? ''}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description" rows={3} placeholder="Any extra detail"
          defaultValue={task.description ?? ''}
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Due date</label>
          <div className="relative">
            <input
              type="date" name="due_date"
              ref={dateRef}
              defaultValue={task.due_date ?? ''}
              className="w-full rounded border px-3 py-2 pr-10 [&::-webkit-calendar-picker-indicator]:hidden"
            />
            <button
              type="button"
              onClick={openPicker}
              aria-label="Open calendar"
              className="absolute right-0 top-0 flex h-full items-center px-3 opacity-60 hover:opacity-100"
            >
              <CalendarIcon />
            </button>
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Topic</label>
          <input
            name="topic" placeholder="e.g. Coursework"
            defaultValue={task.topic ?? ''}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <button className="rounded border px-4 py-2 font-medium">{submitLabel}</button>
    </form>
  );
}