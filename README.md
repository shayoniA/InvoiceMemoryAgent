**Invoice Memory Agent**: An AI-powered invoice processing agent that learns from past invoices, applies vendor-specific memory, and produces auditable, explainable corrections with confidence-based decision making. The project demonstrates Structured extraction + Persistent memory + Conservative learning + Human-in-the-loop safety + Full auditability.

Here is the demo video:  https://drive.google.com/file/d/13K1Ban2fhJGkOpe8KDr-IMeWLrnAlJ7r/view?usp=sharing

<img width="854" height="1550" alt="image" src="https://github.com/user-attachments/assets/c800c34c-4f5e-40bd-8802-f3a04c8f4d56" />

Its key features are:

1. **Vendor-Specific Memory** - The agent maintains long-term memory per vendor, such as Common field patterns (eg. service date naming) and Historical correction confidence. Memory is stored persistently and reused across runs.

2. **Intelligent Auto-Correction** - When processing a new invoice, the agent:
	 Detects patterns in raw invoice text,
	 Recalls relevant vendor memories,
	 Applies corrections only if confidence is high,
	 Leaves uncertain cases for human review.

3. **Conservative Learning (Safety-First)** - The agent does not blindly learn from every invoice. Learning happens only when:
	 Invoice is not a duplicate,
	 Corrections are applied successfully,
	 Confidence exceeds a safe threshold.

4. **Explainable Decisions & Audit Trail** - Every run produces a full audit trail, including:  Pattern detection --> Memory recall --> Applied corrections --> Final decision reasoning. This makes the agent safe and debuggable.
Example audit steps:
{
  "step": "apply",
  "details": ["Filled serviceDate using vendor memory (Leistungsdatum)"]
}


**How to Run**:
1. Install dependencies - *npm install*  (*pip install -r requirements.txt*)
2. Seed initial memory - *npx ts-node src/seedMemory.ts*
3. Run the agent - *npx ts-node src/index.ts*


**Input Format**: Invoices are read from *data/invoices_extracted.json*. Each invoice must have a unique invoiceId.
**Output Format**: The agent outputs a structured and fully transparent result, containing:  normalizedInvoice, proposedCorrections, confidenceScore, requiresHumanReview, memoryUpdates, auditTrail.


**Core Logic**:

1. **Invoice Ingestion**: data/invoices_extracted.json - Agent reads invoices one-by-one. Each invoice must have a unique invoiceId.

2. **Duplicate Detection (Safety Gate)**: src/index.ts - The agent checks isDuplicate(invoice.invoiceId). If duplicate, then No learning, and No memory updates, instead Safe exit with explanation.

3. **Pattern Detection**: src/index.ts - Agent scans missing fields or raw invoice text. Examples of detected patterns: SERVICE_DATE_IN_TEXT, POSSIBLE_DUPLICATE. These patterns guide what memories to recall.

4. **Memory Recall (Vendor-Scoped)**: src/memory/memoryStore.ts
Memory is recalled using vendor + memoryType + detected patterns. Only relevant memories are returned. Here is an example of memory structure:
{
   vendor: "Supplier GmbH",
   pattern: "Leistungsdatum",
   action: "Fill serviceDate",
   confidence: 0.85
}

6. **Memory Application (Auto-Correction)**: src/index.ts
If a field is missing / a matching memory exists / confidence is high enough, then the agent applies a correction that is explainable and logged - Filled serviceDate using vendor memory (Leistungsdatum).

7. **Confidence Scoring**: src/decision/decide.ts
Final confidence is computed using - Base invoice confidence, Memory confidence boosts, Penalties for uncertainty.
Example:  *0.78 (base) + 0.05 (memory boost) = 0.83*

8. **Decision Gate (Human-in-the-Loop)**: Safe automation based on final confidence - *requiresHumanReview = confidence < 0.75* (threshold)

9. **Learning & Memory Update (Controlled)**: src/memory/memoryStore.ts
Memory is updated only if - Invoice is not duplicate, Correction was applied, Confidence is high. For duplicate invoice, learning is skipped.
*timesUsed++; timesApproved++; confidence += small_delta*

10. **Audit Trail Generation**: src/audit/auditTrail.ts
Audit steps include: recall --> apply --> decide --> learn. Every step is recorded -
{
  "step": "recall",
  "details": "Retrieved 3 memories"
}


**End-to-End Flow Summary**:
Invoice --> Duplicate Check --> Pattern Detection --> Vendor Memory Recall --> Auto-Correction (if safe) --> Confidence Scoring --> Decision (Auto/Human) --> Learning (if allowed) --> Audit Trail.

**Design Decisions**: Why This Logic Is Production-Grade?
1.	Learning is conservative. Not all corrections are auto-learned.
2.	Memory updates are gated by explicit confidence thresholds.
3.	Auditability is prioritized over speed.
4.	No silent automation.
5.	Full traceability.
These choices reflect real-world AI system constraints.

**Future Extensions**:
1.	Human approval feedback loop
2.	Decay-based memory aging
3.	Multi-field correction learning
4.	Vendor confidence drift analysis


Author:
**Sayani Adhikary**
