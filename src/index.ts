import { initDatabase } from "./db/database";
import { recall } from "./pipeline/recall";
import { decide } from "./services/decide";
import invoicesData from "./data/invoices_extracted.json";
import { Invoice } from "./types/invoice";
import { applyMemory } from "./services/applyMemory";
import { logAudit } from "./memory/auditLogger";
import { AgentOutput } from "./types/output";
import { fetchAuditTrail } from "./memory/fetchAudit";

function bootstrap() {
  console.log("Initializing AI Agent Memory...");
  initDatabase();
  const invoices = invoicesData as Invoice[];
  const firstInvoice = invoices[0];
  if (!firstInvoice) {
    throw new Error("No invoices found in extracted data");
  }
  const invoice: Invoice = firstInvoice;
  // Recall
  const recallResult = recall(invoice);
  // Stop learning on duplicates
  if (recallResult.isDuplicate)
    console.log("Duplicate invoice detected - skipping learning & auto-correction.");
  // Apply
  const applied = applyMemory(invoice, recallResult.memories);
  logAudit(invoice.invoiceId, "apply", JSON.stringify(applied.proposedCorrections));
  // Decide
  const finalConfidence = Math.min(1, invoice.confidence + applied.confidenceBoost);
  const decision = decide(applied.proposedCorrections, finalConfidence);
  // Output
    const output: AgentOutput = {
        normalizedInvoice: applied.normalizedInvoice,
        proposedCorrections: applied.proposedCorrections,
        requiresHumanReview: decision.requiresHumanReview,
        reasoning: decision.requiresHumanReview
        ? "Insufficient confidence or weak memory match"
        : "High-confidence vendor memory applied",
        confidenceScore: finalConfidence,
        memoryUpdates: [],
        auditTrail: []
    };
    output.auditTrail = fetchAuditTrail(invoice.invoiceId);
  console.log(JSON.stringify(output, null, 2));
}
bootstrap();