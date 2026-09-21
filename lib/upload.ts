import { z } from 'zod';

export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

export const uploadInputSchema = z.object({
  text: z.string().min(1, 'Document text cannot be empty'),
  filename: z.string().optional(),
  mimeType: z.string().optional(),
});

export type UploadInput = z.infer<typeof uploadInputSchema>;

export function isAcceptedFileType(mimeType: string): boolean {
  return (ACCEPTED_FILE_TYPES as readonly string[]).includes(mimeType);
}

export function isFileSizeOk(sizeBytes: number): boolean {
  return sizeBytes <= MAX_FILE_SIZE_BYTES;
}
