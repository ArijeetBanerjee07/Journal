import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'journal.db');
const db = new Database(dbPath);

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS journal_entries (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    ambience TEXT NOT NULL,
    text TEXT NOT NULL,
    emotion TEXT,
    keywords TEXT,
    summary TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
