export function applySchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      due_date TEXT,
      topic TEXT NOT NULL DEFAULT 'General',
      status TEXT NOT NULL DEFAULT 'todo',
      archived_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const columns = db.prepare('PRAGMA table_info(tasks)').all();
  if (!columns.some((c) => c.name === 'status')) {
    db.exec(`ALTER TABLE tasks ADD COLUMN status TEXT NOT NULL DEFAULT 'todo'`);
  }

  db.exec(`UPDATE tasks SET topic = 'General' WHERE topic = ''`);
}