export type MemoryType =
  | "VENDOR"
  | "CORRECTION"
  | "RESOLUTION"
  | "DUPLICATE";

export interface BaseMemory {
  id: string;
  vendor: string;
  memoryType: MemoryType;
  pattern: string;
  action: string;
  confidence: number;
  timesUsed: number;
  timesApproved: number;
  lastUpdated: string;
}

export interface VendorMemory extends BaseMemory {
  memoryType: "VENDOR";
}

export interface CorrectionMemory extends BaseMemory {
  memoryType: "CORRECTION";
  field: string;
}

export interface ResolutionMemory extends BaseMemory {
  memoryType: "RESOLUTION";
  outcome: "approved" | "rejected";
}
