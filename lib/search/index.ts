import MiniSearch from 'minisearch';
import type { ParsedDocument, Clause } from '@/lib/parser';

export interface SearchResult extends Clause {
  score: number;
}

export class DocumentSearch {
  private miniSearch: MiniSearch<Clause>;

  constructor(document: ParsedDocument) {
    this.miniSearch = new MiniSearch({
      fields: ['normalizedText'], // fields to index for full-text search
      storeFields: ['id', 'sectionIndex', 'clauseIndex', 'rawText', 'normalizedText', 'charStart', 'charEnd'], // fields to return with search results
      idField: 'id',
    });

    // Flatten all clauses from all sections
    const allClauses = document.sections.flatMap(section => section.clauses);
    this.miniSearch.addAll(allClauses);
  }

  /**
   * Search the document for the top K most relevant clauses.
   */
  retrieve(query: string, k: number = 6): SearchResult[] {
    const results = this.miniSearch.search(query, {
      prefix: true,
      fuzzy: 0.2, // allow slight misspellings
    });

    // Sort by score and take top K
    return results.slice(0, k).map(res => ({
      id: res.id,
      sectionIndex: res.sectionIndex,
      clauseIndex: res.clauseIndex,
      rawText: res.rawText,
      normalizedText: res.normalizedText,
      charStart: res.charStart,
      charEnd: res.charEnd,
      score: res.score,
    }));
  }
}
