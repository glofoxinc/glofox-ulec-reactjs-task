import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedDatabase } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'gyms.sqlite');

export function openDatabase(): Database.Database {
  fs.mkdirSync(dataDir, { recursive: true });

  const isNew = !fs.existsSync(dbPath);
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS gyms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      bookings_count INTEGER NOT NULL,
      revenue_cents INTEGER NOT NULL,
      capacity INTEGER NOT NULL,
      member_count INTEGER NOT NULL,
      utilization REAL NOT NULL,
      avg_rating REAL NOT NULL
    );
  `);

  const count = db.prepare('SELECT COUNT(*) AS count FROM gyms').get() as {
    count: number;
  };

  if (isNew || count.count === 0) {
    seedDatabase(db);
  }

  return db;
}
