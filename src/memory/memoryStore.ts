import { db } from "../db/database";
import { BaseMemory } from "../types/memory";
import { randomUUID } from "crypto";

export function fetchMemory(vendor: string, memoryType?: string): BaseMemory[] {
  if (memoryType) {
    const stmt = db.prepare("SELECT * FROM memory WHERE vendor = ? AND memoryType = ?");
    return stmt.all(vendor, memoryType) as BaseMemory[];
  }
  const stmt = db.prepare("SELECT * FROM memory WHERE vendor = ?");
  return stmt.all(vendor) as BaseMemory[];
}

export function saveMemory(memory: BaseMemory) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO memory
    (id, vendor, memoryType, pattern, action, confidence, timesUsed, timesApproved, lastUpdated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(memory.id || randomUUID(),
    memory.vendor, memory.memoryType,
    memory.pattern, memory.action,
    memory.confidence, memory.timesUsed,
    memory.timesApproved, new Date().toISOString());
}
export function updateMemoryConfidence(id: string, approved: boolean) {
  const mem = db.prepare(`SELECT * FROM memory WHERE id = ?`).get(id) as BaseMemory | undefined;
  if (!mem) return;
  const newConfidence = approved ? Math.min(1, mem.confidence + 0.05) : Math.max(0, mem.confidence - 0.1);

  db.prepare(`
    UPDATE memory
    SET confidence = ?, 
        timesUsed = timesUsed + 1,
        timesApproved = timesApproved + ?,
        lastUpdated = ?
    WHERE id = ?
  `).run(
    newConfidence,
    approved ? 1 : 0,
    new Date().toISOString(),
    id
  );
}
