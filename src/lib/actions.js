'use server';

import db from './db.js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as tasks from './tasks.js';

function readForm(formData) {
  return {
    title: formData.get('title'),
    description: formData.get('description'),
    due_date: formData.get('due_date'),
    topic: formData.get('topic'),
  };
}

function revalidateAll() {
  revalidatePath('/');
  revalidatePath('/archive');
}

export async function createTask(formData) {
  tasks.createTask(db, readForm(formData));
  revalidateAll();
}

export async function updateTask(id, formData) {
  tasks.updateTask(db, id, readForm(formData));
  revalidateAll();
  redirect('/');
}

export async function setStatus(id, status) {
  tasks.setStatus(db, id, status);
  revalidateAll();
}

export async function archiveTask(id) {
  tasks.archiveTask(db, id);
  revalidateAll();
}

export async function restoreTask(id) {
  tasks.restoreTask(db, id);
  revalidateAll();
}