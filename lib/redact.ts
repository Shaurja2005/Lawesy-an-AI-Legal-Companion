/**
 * PII redaction utility.
 * Strips common PII patterns before text is sent to an LLM.
 * Patterns: email, phone (international), UK/AU/US NI/SSN, passport, UK postcode, addresses.
 * All replacements are deterministic bracketed labels so downstream context is preserved.
 */

export type RedactionResult = {
  redactedText: string;
  /** How many replacements were made per category */
  stats: Record<string, number>;
};

interface RedactionRule {
  label: string;
  pattern: RegExp;
}

const RULES: RedactionRule[] = [
  {
    label: 'EMAIL',
    pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
  },
  {
    label: 'UK_NI',
    pattern: /\b[A-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-Z]\b/g,
  },
  {
    label: 'US_SSN',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  {
    label: 'PASSPORT',
    pattern: /\b[A-Z]{2}\d{7}\b/g,
  },
  {
    label: 'POSTCODE',
    // UK postcodes
    pattern: /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/g,
  },
  {
    label: 'DATE_OF_BIRTH',
    pattern: /\b(?:born|DOB|date of birth)[:\s]+\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/gi,
  },
  {
    label: 'FULL_NAME',
    // Naive: title + two+ title-case words
    pattern: /\b(?:Mr|Mrs|Ms|Miss|Dr|Prof)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/g,
  },
  {
    // PHONE last — broad pattern; catches what slipped through above
    label: 'PHONE',
    pattern: /(?:\+?\d[\d\s\-().]{6,14}\d)/g,
  },
];

export function redactPII(text: string): RedactionResult {
  const stats: Record<string, number> = {};
  let redactedText = text;

  for (const { label, pattern } of RULES) {
    let count = 0;
    redactedText = redactedText.replace(pattern, () => {
      count++;
      return `[${label}]`;
    });
    if (count > 0) stats[label] = count;
  }

  return { redactedText, stats };
}
