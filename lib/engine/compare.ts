import type { ParsedDocument, Clause } from '@/lib/parser';

export type ChangeType = 'added' | 'removed' | 'changed' | 'same';

export interface AlignedClause {
  id: string;
  originalClause?: Clause;
  newClause?: Clause;
  changeType: ChangeType;
  similarity: number;
}

// Simple Jaccard similarity for textual alignment
function calculateSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  
  if (set1.size === 0 && set2.size === 0) return 1;
  if (set1.size === 0 || set2.size === 0) return 0;
  
  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) intersection++;
  }
  
  const union = set1.size + set2.size - intersection;
  return intersection / union;
}

export function alignDocuments(doc1: ParsedDocument, doc2: ParsedDocument): AlignedClause[] {
  const clauses1 = doc1.sections.flatMap(s => s.clauses);
  const clauses2 = doc2.sections.flatMap(s => s.clauses);
  
  const aligned: AlignedClause[] = [];
  const usedIds2 = new Set<string>();
  let alignCounter = 1;

  for (const c1 of clauses1) {
    let bestMatch: Clause | null = null;
    let highestSim = 0;

    for (const c2 of clauses2) {
      if (usedIds2.has(c2.id)) continue;
      
      const sim = calculateSimilarity(c1.normalizedText, c2.normalizedText);
      if (sim > highestSim) {
        highestSim = sim;
        bestMatch = c2;
      }
    }

    if (bestMatch && highestSim > 0.4) {
      usedIds2.add(bestMatch.id);
      aligned.push({
        id: `align_${alignCounter++}`,
        originalClause: c1,
        newClause: bestMatch,
        changeType: highestSim === 1 ? 'same' : 'changed',
        similarity: highestSim,
      });
    } else {
      aligned.push({
        id: `align_${alignCounter++}`,
        originalClause: c1,
        changeType: 'removed',
        similarity: 0,
      });
    }
  }

  // Any left over in clauses2 are added
  for (const c2 of clauses2) {
    if (!usedIds2.has(c2.id)) {
      aligned.push({
        id: `align_${alignCounter++}`,
        newClause: c2,
        changeType: 'added',
        similarity: 0,
      });
    }
  }

  // Return the aligned array, maybe sort by original position if possible
  return aligned;
}
