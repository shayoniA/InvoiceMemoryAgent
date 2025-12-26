import { Invoice } from "../types/invoice";
import { BaseMemory } from "../types/memory";

export function applyMemory(
  invoice: Invoice,
  memories: BaseMemory[]
) {
  const proposedCorrections: string[] = [];
  let confidenceBoost = 0;

  for (const mem of memories) {
    if (mem.memoryType === "VENDOR") {
      if (
        mem.pattern === "SERVICE_DATE_IN_TEXT" &&
        !invoice.fields.serviceDate &&
        invoice.rawText.includes("Leistungsdatum")
      ) {
        invoice.fields.serviceDate =
          invoice.rawText.match(/Leistungsdatum:\s*(\d{2}\.\d{2}\.\d{4})/)?.[1] || null;

        proposedCorrections.push(
          "Filled serviceDate using vendor memory (Leistungsdatum)"
        );
        confidenceBoost += 0.05;
      }
    }
  }

  return {
    normalizedInvoice: invoice,
    proposedCorrections,
    confidenceBoost
  };
}
