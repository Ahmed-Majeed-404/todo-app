'use server';

import db from './db';
import { revalidatePath } from 'next/cache';

export async function addTask(formData) {
  const title = formData.get('title')?.trim();
  if (!title) return;
  db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title);
  revalidatePath('/');
}

export async function toggleTask(id) {
  db.prepare('UPDATE tasks SET done = 1 - done WHERE id = ?').run(id);
  revalidatePath('/');
}