import { z } from 'zod';

// ─── Canonical data types (from SOURCE_OF_TRUTH.md §4) ───────────────────────

export const clauseSchema = z.object({
  id: z.string(),          // e.g. "S2.3"
  sectionIndex: z.number(),
  clauseIndex: z.number(),
  rawText: z.string(),
  normalizedText: z.string(),
  charStart: z.number(),
  charEnd: z.number(),
});

export const sectionSchema = z.object({
  index: z.number(),
  heading: z.string(),
  rawText: z.string(),
  charStart: z.number(),
  charEnd: z.number(),
  clauses: z.array(clauseSchema),
});

export const parsedDocumentSchema = z.object({
  id: z.string(),
  filename: z.string().optional(),
  rawText: z.string(),
  charCount: z.number(),
  sections: z.array(sectionSchema),
  parsedAt: z.string(), // ISO timestamp
});

export type Clause = z.infer<typeof clauseSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type ParsedDocument = z.infer<typeof parsedDocumentSchema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .trim();
}

const HEADING_PATTERN = /^(ARTICLE|SECTION|CLAUSE|SCHEDULE|EXHIBIT|APPENDIX|PART)[\s\d.]+/i;
const NUMBERED_HEADING = /^\d+(\.\d+)*\s+[A-Z]/;

function looksLikeHeading(line: string): boolean {
  return HEADING_PATTERN.test(line) || NUMBERED_HEADING.test(line.trim());
}

// ─── Main parser ─────────────────────────────────────────────────────────────

export function parseDocument(rawText: string, filename?: string): ParsedDocument {
  const lines = rawText.split(/\r?\n/);
  const sections: Section[] = [];
  let currentHeading = 'Preamble';
  let currentLines: string[] = [];
  let currentStart = 0;
  let charPos = 0;
  let sectionIndex = 0;

  function flushSection() {
    const rawSection = currentLines.join('\n').trim();
    if (!rawSection) return;
    const sectionStart = currentStart;
    const sectionEnd = sectionStart + rawSection.length;

    // Split section into clause-like paragraphs
    const paragraphs = rawSection.split(/\n{2,}/).filter(p => p.trim().length > 0);
    const clauses: Clause[] = paragraphs.map((p, clauseIndex) => {
      const clauseId = `S${sectionIndex + 1}.${clauseIndex + 1}`;
      const clauseStart = sectionStart + rawSection.indexOf(p);
      return {
        id: clauseId,
        sectionIndex,
        clauseIndex,
        rawText: p,
        normalizedText: normalizeText(p),
        charStart: clauseStart,
        charEnd: clauseStart + p.length,
      };
    });

    sections.push({
      index: sectionIndex++,
      heading: currentHeading,
      rawText: rawSection,
      charStart: sectionStart,
      charEnd: sectionEnd,
      clauses,
    });
    currentLines = [];
    currentStart = charPos;
    currentHeading = '';
  }

  for (const line of lines) {
    charPos += line.length + 1; // +1 for newline

    if (looksLikeHeading(line) && line.trim().length > 0) {
      flushSection();
      currentHeading = line.trim();
      currentStart = charPos - line.length - 1;
    } else {
      currentLines.push(line);
    }
  }
  flushSection();

  return parsedDocumentSchema.parse({
    id: generateId(),
    filename,
    rawText,
    charCount: rawText.length,
    sections,
    parsedAt: new Date().toISOString(),
  });
}
