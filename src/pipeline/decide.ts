import { BaseMemory } from "../types/memory";

export function decide(memories: BaseMemory[], patterns: string[]) {
  const actions: string[] = [];

  for (const memory of memories) {
    if (patterns.includes(memory.pattern)) {
      actions.push(memory.action);
    }
  }

  return {
    actions,
    requiresHumanReview: actions.length === 0
  };
}
