import { DB } from "https://deno.land/x/sqlite/mod.ts";

try {
  await Deno.remove("knowledge_checklist.db");
} catch {
  // nothing to remove
}

const db = new DB("./knowledge_checklist.db");

await db.query(`
  CREATE TABLE learning_objectives(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cohort_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    learning_objective TEXT NOT NULL
  )`);

await db.query(
  `CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    encrypted_password TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    admin BOOLEAN NOT NULL
  )`
);

await db.query(
  `CREATE TABLE sessions (
    id TEXT PRIMARY KEY NOT NULL,
    created_at DATETIME NOT NULL,
    user_id INTEGER NOT NULL
  )`
);
