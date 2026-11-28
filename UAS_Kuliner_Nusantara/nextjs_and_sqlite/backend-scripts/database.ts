import path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

let dbPromise: Promise<Database> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(process.cwd(), "data", "database.db"),
      driver: sqlite3.Database,
    });
  }
  return dbPromise;
}