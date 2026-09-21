import { describe, it, expect } from 'vitest';
import { parseDocument } from '../../lib/parser';

const SAMPLE_CONTRACT = `
ARTICLE 1 DEFINITIONS

For the purposes of this Agreement, the following terms shall have the meanings set forth below.

1.1 "Agreement" means this Software License Agreement.

1.2 "Licensor" means Acme Corp, Inc.

ARTICLE 2 LICENSE GRANT

Subject to the terms and conditions of this Agreement, Licensor hereby grants Licensee a non-exclusive license.

2.1 The license granted in Section 2 is limited to internal use only.
`;

describe('parseDocument', () => {
  it('should return a ParsedDocument with an id and parsedAt', () => {
    const doc = parseDocument(SAMPLE_CONTRACT);
    expect(doc.id).toMatch(/^doc_/);
    expect(doc.parsedAt).toBeTruthy();
    expect(doc.charCount).toBe(SAMPLE_CONTRACT.length);
  });

  it('should segment text into sections on ARTICLE headings', () => {
    const doc = parseDocument(SAMPLE_CONTRACT);
    const headings = doc.sections.map(s => s.heading);
    expect(headings.some(h => h.includes('ARTICLE 1'))).toBe(true);
    expect(headings.some(h => h.includes('ARTICLE 2'))).toBe(true);
  });

  it('should generate clause IDs in S{section}.{clause} format', () => {
    const doc = parseDocument(SAMPLE_CONTRACT);
    const allClauses = doc.sections.flatMap(s => s.clauses);
    expect(allClauses.length).toBeGreaterThan(0);
    for (const clause of allClauses) {
      expect(clause.id).toMatch(/^S\d+\.\d+$/);
    }
  });

  it('should normalize text in clauses', () => {
    const doc = parseDocument('SECTION 1 Test\n\nHello   world\u201c quoted\u201d');
    const clause = doc.sections.flatMap(s => s.clauses)[0];
    expect(clause?.normalizedText).toContain('Hello world');
    expect(clause?.normalizedText).toContain('"');
  });

  it('should handle empty input gracefully', () => {
    const doc = parseDocument('');
    expect(doc.sections).toHaveLength(0);
    expect(doc.charCount).toBe(0);
  });

  it('should attach filename when provided', () => {
    const doc = parseDocument('Some text', 'contract.pdf');
    expect(doc.filename).toBe('contract.pdf');
  });
});
