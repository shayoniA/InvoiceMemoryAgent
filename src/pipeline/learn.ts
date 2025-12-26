import { saveMemory } from "../memory/memoryStore";
import { randomUUID } from "crypto";

export function learnFromHumanCorrection(
  invoiceId: string,
  vendor: string,
  correction: {
    field: string;
    reason: string;
  },
  approved: boolean
) {
  saveMemory({
    id: randomUUID(),
    vendor,
    memoryType: "CORRECTION",
    pattern: correction.reason,
    action: `Auto-correct ${correction.field}`,
    confidence: approved ? 0.65 : 0.4,
    timesUsed: 1,
    timesApproved: approved ? 1 : 0,
    lastUpdated: new Date().toISOString()
  });
}

export function storeResolution(
  vendor: string,
  outcome: "approved" | "rejected"
) {
  saveMemory({
    id: randomUUID(),
    vendor,
    memoryType: "RESOLUTION",
    pattern: "FINAL_DECISION",
    action: outcome === "approved" ? "Auto-approval reinforced" : "Auto-approval weakened",
    confidence: outcome === "approved" ? 0.7 : 0.3,
    timesUsed: 1,
    timesApproved: outcome === "approved" ? 1 : 0,
    lastUpdated: new Date().toISOString()
  });
}
