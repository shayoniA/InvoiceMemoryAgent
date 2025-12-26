import Database from "better-sqlite3";
import { randomUUID } from "crypto";
const db = new Database("agent_memory.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS memory (
    id TEXT PRIMARY KEY,
    vendor TEXT NOT NULL,
    memoryType TEXT NOT NULL,
    pattern TEXT,
    action TEXT,
    confidence REAL,
    timesUsed INTEGER,
    timesApproved INTEGER,
    lastUpdated TEXT
  )
`).run();

const insert = db.prepare(`
  INSERT INTO memory 
    (id, vendor, memoryType, pattern, action, confidence, timesUsed, timesApproved, lastUpdated)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insert.run(
  randomUUID(),
  "VendorA",
  "VENDOR",
  "DISCOUNT_PATTERN",
  "Applied standard discount",
  0.9,
  2,
  1,
  new Date().toISOString()
);

insert.run(
  randomUUID(),
  "VendorB",
  "RESOLUTION",
  "LATE_PAYMENT",
  "Reminded client about late payment",
  0.8,
  3,
  2,
  new Date().toISOString()
);

insert.run(
  randomUUID(),
  "VendorA",
  "CORRECTION",
  "FREIGHT_CHARGES",
  "Added freight charges in invoice",
  0.95,
  1,
  1,
  new Date().toISOString()
);

insert.run(
  randomUUID(),
  "Supplier GmbH",
  "VENDOR",
  "SERVICE_DATE_IN_TEXT",
  "Auto-approve invoices with known PO numbers",
  0.85,
  3,
  3,
  new Date().toISOString()
);

console.log("Sample memories inserted!");