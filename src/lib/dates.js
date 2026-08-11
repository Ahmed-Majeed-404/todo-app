export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
}

export function isOverdue(task) {
  if (!task.due_date) return false;
  if (task.status === 'completed') return false;
  return task.due_date < todayISO();
}