import { Invoice } from "../types/invoice";
import { fetchMemory } from "../memory/memoryStore";
import { logAudit } from "../memory/auditLogger";
import {detectServiceDateHint, detectVatIncluded, detectCurrencyInText, detectFreightDescription} from "../logic/heuristics";
import { isDuplicateInvoice } from "../logic/duplicateDetector";
import { BaseMemory } from "../types/memory";

export interface RecallResult {
  memories: BaseMemory[];
  detectedPatterns: string[];
  isDuplicate: boolean;
}

export function recall(invoice: Invoice): RecallResult {
  const detectedPatterns: string[] = [];
  if (detectServiceDateHint(invoice.rawText))
    detectedPatterns.push("SERVICE_DATE_IN_TEXT");
  if (detectVatIncluded(invoice.rawText))
    detectedPatterns.push("VAT_INCLUDED");
  if (!invoice.fields.currency && detectCurrencyInText(invoice.rawText))
    detectedPatterns.push("CURRENCY_IN_TEXT");

  const hasFreight = invoice.fields.lineItems?.some(li =>
    li.sku === "FREIGHT" || li.description?.toLowerCase().includes("freight")
  ) ?? false;

  if (hasFreight)
    detectedPatterns.push("FREIGHT_DESCRIPTION");
  const duplicate = isDuplicateInvoice(invoice);
  if (duplicate)
    detectedPatterns.push("POSSIBLE_DUPLICATE");
  const memories = fetchMemory(invoice.vendor);
  logAudit(
    invoice.invoiceId,
    "recall",
    `Detected patterns: ${detectedPatterns.join(", ")}; Retrieved ${memories.length} memories`
  );

  return {memories, detectedPatterns, isDuplicate: duplicate};
}