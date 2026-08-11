import Database from 'better-sqlite3';
import path from 'path';

if (!global._db) {
  global._db = new Database(path.join(process.cwd(), 'todo.db'));
  global._db.pragma('journal_mode = WAL');
  global._db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export default global._db;