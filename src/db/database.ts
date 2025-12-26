import Database from "better-sqlite3";
export const db = new Database("agent_memory.db");

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory (
      id TEXT PRIMARY KEY,
      vendor TEXT NOT NULL,
      memoryType TEXT NOT NULL,
      pattern TEXT NOT NULL,
      action TEXT NOT NULL,
      confidence REAL NOT NULL,
      timesUsed INTEGER NOT NULL,
      timesApproved INTEGER NOT NULL,
      lastUpdated TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS duplicate_registry (
      id TEXT PRIMARY KEY,
      vendor TEXT NOT NULL,
      invoiceNumber TEXT NOT NULL,
      invoiceDate TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      step TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      details TEXT NOT NULL
    );
  `);
}

