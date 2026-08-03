import db from "./db";

const toTask = (row) => ({
  ...row,
  completed: Boolean(row.completed),
  archived: Boolean(row.archived),
});

export function getActiveTasks() {
  return db
    .prepare(
      `SELECT * FROM tasks
       WHERE archived = 0
       ORDER BY completed ASC,
                due_date IS NULL, due_date ASC,
                id DESC`
    )
    .all()
    .map(toTask);
}

export function getArchivedTasks() {
  return db
    .prepare("SELECT * FROM tasks WHERE archived = 1 ORDER BY id DESC")
    .all()
    .map(toTask);
}

export function createTask({ title, description, dueDate, topic }) {
  const result = db
    .prepare(
      `INSERT INTO tasks (title, description, due_date, topic)
       VALUES (?, ?, ?, ?)`
    )
    .run(
      title.trim(),
      (description ?? "").trim(),
      dueDate?.trim() || null,
      (topic ?? "").trim()
    );

  return toTask(
    db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid)
  );
}

export function toggleTask(id) {
  db.prepare("UPDATE tasks SET completed = NOT completed WHERE id = ?").run(id);
}

export function archiveTask(id) {
  db.prepare("UPDATE tasks SET archived = 1 WHERE id = ?").run(id);
}

export function unarchiveTask(id) {
  db.prepare("UPDATE tasks SET archived = 0 WHERE id = ?").run(id);
}