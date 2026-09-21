import type { DocType, DocumentFindings, ClauseAnalysis } from '../schemas/ai';

export interface MissingProtection {
  item: string;
  whyItMatters: string;
}

const MISSING_PROTECTION_CHECKLIST: Partial<Record<DocType, MissingProtection[]>> = {
  lease: [
    {
      item: 'Deposit Return Timeline',
      whyItMatters: 'Without a clear deadline for when your security deposit will be returned, the landlord could hold it indefinitely.'
    },
    {
      item: 'Wear and Tear Exception',
      whyItMatters: 'You should not be responsible for normal wear and tear to the property.'
    }
  ],
  employment: [
    {
      item: 'Severance Terms',
      whyItMatters: 'Clarifies what you are entitled to if terminated without cause.'
    }
  ]
};

export function evaluateMissingProtections(docType: DocType, clauses: ClauseAnalysis[]): MissingProtection[] {
  const expected = MISSING_PROTECTION_CHECKLIST[docType] || [];
  if (expected.length === 0) return [];

  // For the MVP, we do a very naive check: 
  // If the clause categories/titles don't seem to mention the missing protection, we flag it.
  const allText = clauses.map(c => `${c.title} ${c.plainSummary} ${c.category}`).join(' ').toLowerCase();

  return expected.filter(protection => {
    // Basic heuristic: check if key words from the protection item exist in the analysis
    const keywords = protection.item.toLowerCase().split(' ');
    // If none of the keywords are found in the clause summaries, flag it as missing
    const foundAny = keywords.some(kw => allText.includes(kw));
    return !foundAny;
  });
}

/**
 * Identifies deterministic inconsistencies across clauses.
 */
export function evaluateInconsistencies(clauses: ClauseAnalysis[]): { description: string; clauseIds: string[] }[] {
  const inconsistencies: { description: string; clauseIds: string[] }[] = [];

  // MVP heuristic: Check if multiple different deadlines exist for the same descriptive action
  // e.g., "notice period" appears twice with different relative times
  const deadlineMap = new Map<string, { clauseId: string; relative: string }[]>();

  for (const clause of clauses) {
    for (const deadline of clause.deadlines) {
      if (deadline.relative && deadline.description) {
        // Normalizing the description to group similar deadlines
        const key = deadline.description.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!deadlineMap.has(key)) {
          deadlineMap.set(key, []);
        }
        deadlineMap.get(key)!.push({ clauseId: clause.clauseId, relative: deadline.relative });
      }
    }
  }

  // Find any keys where there are conflicting relative times
  for (const [key, instances] of deadlineMap.entries()) {
    if (instances.length > 1) {
      const uniqueTimes = new Set(instances.map(i => i.relative.toLowerCase()));
      if (uniqueTimes.size > 1) {
        inconsistencies.push({
          description: `Conflicting deadlines found for "${key}". (${Array.from(uniqueTimes).join(' vs ')})`,
          clauseIds: instances.map(i => i.clauseId)
        });
      }
    }
  }

  return inconsistencies;
}
