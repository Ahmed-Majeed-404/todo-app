import { STATUS_VALUES } from './statuses.js';
import { SORTS, DEFAULT_SORT } from './sorts.js';

const DEFAULT_TOPIC = 'General';

export function normalise(input) {
  return {
    title: input.title?.trim() ?? '',
    description: input.description?.trim() ?? '',
    due_date: input.due_date || null,
    topic: input.topic?.trim() || DEFAULT_TOPIC,
  };
}

export function createTask(db, input) {
  const task = normalise(input);
  if (!task.title) return null;
  const result = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (@title, @description, @due_date, @topic)
  `).run(task);
  return result.lastInsertRowid;
}

export function updateTask(db, id, input) {
  const task = normalise(input);
  if (!task.title) return false;
  const result = db.prepare(`
    UPDATE tasks SET title = @title, description = @description,
    due_date = @due_date, topic = @topic WHERE id = @id
  `).run({ ...task, id });
  return result.changes > 0;
}

export function setStatus(db, id, status) {
  if (!STATUS_VALUES.includes(status)) return false;
  const result = db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
  return result.changes > 0;
}

export function archiveTask(db, id) {
  db.prepare(`UPDATE tasks SET archived_at = datetime('now') WHERE id = ?`).run(id);
}

export function restoreTask(db, id) {
  db.prepare('UPDATE tasks SET archived_at = NULL WHERE id = ?').run(id);
}

export function getTask(db, id) {
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

export function listActive(db, sort = DEFAULT_SORT) {
  const orderBy = SORTS[sort] ?? SORTS[DEFAULT_SORT];
  return db.prepare(`
    SELECT * FROM tasks WHERE archived_at IS NULL ORDER BY ${orderBy}
  `).all();
}

export function listArchived(db) {
  return db.prepare(`
    SELECT * FROM tasks WHERE archived_at IS NOT NULL ORDER BY archived_at DESC
  `).all();
}