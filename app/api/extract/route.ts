import { NextResponse } from 'next/server';
import { MAX_FILE_SIZE_BYTES } from '@/lib/upload';

export const runtime = 'nodejs';

const PDF = 'application/pdf';
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function error(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

/**
 * PDF text comes out one visual line per line, with no blank lines between paragraphs,
 * so the clause parser would see the whole page as a single clause. Re-insert paragraph
 * breaks after lines that end a sentence and stop short of the full line width, and
 * around ALL-CAPS headings.
 */
function reflowPdfText(text: string): string {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => !/^page \d+ of \d+$/i.test(l));

  // Typical full-line width: the 90th percentile, so a few long outliers don't skew it.
  const lengths = lines.map(l => l.length).filter(n => n > 0).sort((a, b) => a - b);
  const fullWidth = lengths[Math.floor(lengths.length * 0.9)] ?? 0;
  const isHeading = (l: string) => l.length > 0 && l.length < 60 && /[A-Z]/.test(l) && l === l.toUpperCase();

  const out: string[] = [];
  for (const line of lines) {
    if (isHeading(line) && out.length > 0 && out[out.length - 1] !== '') out.push('');
    out.push(line);
    const endsParagraph = /[.:;!?]$/.test(line) && line.length < fullWidth * 0.85;
    if (endsParagraph || isHeading(line)) out.push('');
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

/**
 * Extracts plain text from an uploaded PDF or DOCX file.
 * Plain-text files are read in the browser and never reach this route.
 */
export async function POST(req: Request) {
  let file: File | null;
  try {
    const form = await req.formData();
    const value = form.get('file');
    file = value instanceof File ? value : null;
  } catch {
    return error('BAD_REQUEST', 'Expected multipart form data with a "file" field.', 400);
  }

  if (!file) return error('BAD_REQUEST', 'No file uploaded.', 400);
  if (file.size > MAX_FILE_SIZE_BYTES) return error('PAYLOAD_TOO_LARGE', 'File is too large. Maximum size is 20 MB.', 413);

  const buffer = Buffer.from(await file.arrayBuffer());
  const isPdf = file.type === PDF || file.name.toLowerCase().endsWith('.pdf');
  const isDocx = file.type === DOCX || file.name.toLowerCase().endsWith('.docx');

  try {
    let text: string;
    if (isPdf) {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: buffer });
      try {
        text = reflowPdfText((await parser.getText()).text);
      } finally {
        await parser.destroy();
      }
    } else if (isDocx) {
      const mammoth = await import('mammoth');
      text = (await mammoth.extractRawText({ buffer })).value;
    } else {
      return error('UNSUPPORTED_TYPE', 'Only PDF and DOCX files can be extracted. Legacy .doc files are not supported.', 415);
    }

    // pdf-parse inserts "-- 1 of 3 --" page markers; drop them.
    text = text.replace(/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/gm, '').trim();

    if (!text) {
      return error('NO_TEXT', 'No selectable text found. The file may be a scanned image — try pasting the text instead.', 422);
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error('[Extract] Failed to extract text:', err);
    return error('EXTRACT_FAILED', 'Could not read this file. It may be corrupted or password-protected.', 422);
  }
}
