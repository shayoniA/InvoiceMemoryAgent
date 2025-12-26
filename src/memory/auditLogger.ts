import { db } from "../db/database";
import { randomUUID } from "crypto";

export function logAudit(
  invoiceId: string,
  step: "recall" | "apply" | "decide" | "learn",
  details: string
) {
  db.prepare(`INSERT INTO audit_log (id, invoiceId, step, timestamp, details) VALUES (?, ?, ?, ?, ?)
  `).run(randomUUID(), invoiceId, step, new Date().toISOString(), details);
}
