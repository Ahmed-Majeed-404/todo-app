"use client";

import { useRef, useState } from "react";
import { addTaskAction } from "@/app/actions";

export default function TaskForm() {
  const formRef = useRef(null);
  const [error, setError] = useState(null);

  async function handleSubmit(formData) {
    const result = await addTaskAction(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setError(null);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-lg border border-neutral-200 p-4"
    >
      <input
        name="title"
        placeholder="Title"
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
      />

      <textarea
        name="description"
        placeholder="Description"
        rows={2}
        className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
      />

      <div className="flex gap-3">
        <input
          type="date"
          name="dueDate"
          className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          name="topic"
          placeholder="Topic"
          className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="rounded bg-neutral-900 px-4 py-2 text-sm text-white hover:bg-neutral-700"
      >
        Add task
      </button>
    </form>
  );
}