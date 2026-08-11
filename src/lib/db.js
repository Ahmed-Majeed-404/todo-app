import Database from 'better-sqlite3';
import path from 'path';

if (!global._db) {
  global._db = new Database(path.join(process.cwd(), 'todo.db'));
  global._db.pragma('journal_mode = WAL');

  global._db.exec(`
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

  const columns = global._db.prepare('PRAGMA table_info(tasks)').all();
  if (!columns.some((c) => c.name === 'status')) {
    global._db.exec(`ALTER TABLE tasks ADD COLUMN status TEXT NOT NULL DEFAULT 'todo'`);
  }

  global._db.exec(`UPDATE tasks SET topic = 'General' WHERE topic = ''`);
}

export default global._db;