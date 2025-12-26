import { db } from "../db/database";
import { Invoice } from "../types/invoice";
import { randomUUID } from "crypto";

export function isDuplicateInvoice(invoice: Invoice): boolean {
  const row = db.prepare(`SELECT * FROM duplicate_registry WHERE vendor = ? AND invoiceNumber = ?`).get(invoice.vendor, invoice.fields.invoiceNumber);
  if (row) return true;
  db.prepare(`INSERT INTO duplicate_registry (id, vendor, invoiceNumber, invoiceDate)
    VALUES (?, ?, ?, ?)
  `).run(
    randomUUID(),
    invoice.vendor,
    invoice.fields.invoiceNumber,
    invoice.fields.invoiceDate
  );
  return false;
}
