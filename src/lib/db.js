import Database from 'better-sqlite3';
import path from 'path';
import { applySchema } from './schema.js';

if (!global._db) {
  global._db = new Database(path.join(process.cwd(), 'todo.db'));
  global._db.pragma('journal_mode = WAL');
  applySchema(global._db);
}

export default global._db;