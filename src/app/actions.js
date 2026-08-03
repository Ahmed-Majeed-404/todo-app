"use server";

import { revalidatePath } from "next/cache";
import {
  createTask,
  toggleTask,
  archiveTask,
  unarchiveTask,
} from "@/lib/tasks";

export async function addTaskAction(formData) {
  const title = formData.get("title");

  if (!title || !title.trim()) {
    return { error: "Title is required" };
  }

  createTask({
    title,
    description: formData.get("description"),
    dueDate: formData.get("dueDate"),
    topic: formData.get("topic"),
  });

  revalidatePath("/");
  return { ok: true };
}

export async function toggleTaskAction(id) {
  toggleTask(id);
  revalidatePath("/");
}

export async function archiveTaskAction(id) {
  archiveTask(id);
  revalidatePath("/");
}

export async function unarchiveTaskAction(id) {
  unarchiveTask(id);
  revalidatePath("/");
}
