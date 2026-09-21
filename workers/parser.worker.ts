/**
 * Parser Web Worker.
 * Receives a {type: 'PARSE', payload: {text: string, filename?: string}} message
 * and posts back {type: 'RESULT', payload: ParsedDocument} | {type: 'ERROR', message: string}
 */

import type { ParsedDocument } from '@/lib/parser';
import { parseDocument } from '@/lib/parser';

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type !== 'PARSE') return;

  try {
    const result: ParsedDocument = parseDocument(payload.text, payload.filename);
    self.postMessage({ type: 'RESULT', payload: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    self.postMessage({ type: 'ERROR', message });
  }
};
