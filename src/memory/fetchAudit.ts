import { db } from "../db/database";
import { AuditStep } from "../types/output";

export function fetchAuditTrail(invoiceId: string): AuditStep[] {
  return db.prepare(`
    SELECT step, timestamp, details
    FROM audit_log
    WHERE invoiceId = ?
    ORDER BY timestamp
  `).all(invoiceId) as AuditStep[];
}