export function decide(
  proposedCorrections: string[],
  confidence: number
) {
  const requiresHumanReview =
    confidence < 0.75; // || proposedCorrections.length === 0;

  return {
    requiresHumanReview,
    actions: requiresHumanReview ? [] : proposedCorrections
  };
}
