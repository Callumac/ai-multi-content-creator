import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(),'data.db'));

// Users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT CHECK(role IN ('admin','user')) NOT NULL
  )
`).run();

// (Optional) Generation jobs table
db.prepare(`
  CREATE TABLE IF NOT EXISTS generation_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    topic TEXT,
    type TEXT,
    status TEXT,
    zip_url TEXT
  )
`).run();

export default db;
