import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts";

// try {
//   await Deno.remove("knowledge_checklist.db");
// } catch {
//   // nothing to remove
// }
let config;

// You can use the connection interface to set the connection properties
config = {
  database: "knowledge",
  user: "postgres",
};

const client = new Client("postgres://iwiyqnnt:Z1YjV6TH1xzQBUsFQo8YR94_ZC01ILsQ@tai.db.elephantsql.com/iwiyqnnt");
await client.connect();
await client.queryArray(`
  CREATE TABLE learning_objectives(
    id SERIAL UNIQUE PRIMARY KEY,
    cohort_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    learning_objective TEXT NOT NULL,
    not_confident TEXT DEFAULT '.',
    confident TEXT DEFAULT '.'
  )`);

await client.queryArray(
  `CREATE TABLE users (
    id SERIAL UNIQUE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    cohort_id INTEGER NOT NULL,
    encrypted_password TEXT NOT NULL,
    created_at DATE NOT NULL,
    updated_at DATE NOT NULL,
    admin BOOLEAN NOT NULL
  )`
);

await client.queryArray(
  `CREATE TABLE sessions (
    id TEXT PRIMARY KEY NOT NULL,
    created_at DATE NOT NULL,
    user_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    isAdmin BOOLEAN NOT NULL
  )`
);

await client.queryArray(
  `CREATE TABLE results (
    id SERIAL UNIQUE PRIMARY KEY,
    user_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    cohort_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    learning_objective TEXT NOT NULL,
    score INTEGER DEFAULT 1,
    isActive BOOLEAN DEFAULT FALSE,
    not_confident TEXT NOT NULL,
    confident TEXT NOT NULL,
    dark_mode BOOLEAN DEFAULT FALSE
    )`
);
