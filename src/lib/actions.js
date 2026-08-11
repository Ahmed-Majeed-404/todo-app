'use server';

import db from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function readForm(formData) {
  return {
    title: formData.get('title')?.trim() ?? '',
    description: formData.get('description')?.trim() ?? '',
    due_date: formData.get('due_date') || null,
    topic: formData.get('topic')?.trim() ?? '',
  };
}

function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/archive');
}

export async function createTask(formData) {
  const task = readForm(formData);
  if (!task.title) return;
  db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (@title, @description, @due_date, @topic)
  `).run(task);
  revalidateAll();
}

export async function updateTask(id, formData) {
  const task = readForm(formData);
  if (!task.title) return;
  db.prepare(`
    UPDATE tasks SET title = @title, description = @description,
    due_date = @due_date, topic = @topic WHERE id = @id
  `).run({ ...task, id });
  revalidateAll();
  redirect('/');
}

export async function archiveTask(id) {
  db.prepare(`UPDATE tasks SET archived_at = datetime('now') WHERE id = ?`).run(id);
  revalidateAll();
}

export async function restoreTask(id) {
  db.prepare(`UPDATE tasks SET archived_at = NULL WHERE id = ?`).run(id);
  revalidateAll();
}