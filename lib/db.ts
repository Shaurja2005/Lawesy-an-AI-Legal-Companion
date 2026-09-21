import { z } from 'zod';
import type { ParsedDocument } from '@/lib/parser';

// ─── DB schema ────────────────────────────────────────────────────────────────

const DB_NAME = 'lawesy-db';
const DB_VERSION = 1;
const STORE_DOCUMENTS = 'documents';

export const storedDocumentSchema = z.object({
  id: z.string(),
  filename: z.string().optional(),
  charCount: z.number(),
  sectionCount: z.number(),
  createdAt: z.string(), // ISO
  updatedAt: z.string(), // ISO
  parsed: z.unknown(),   // full ParsedDocument – stored as-is
});

export type StoredDocument = z.infer<typeof storedDocumentSchema>;

// ─── DB lifecycle ─────────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_DOCUMENTS)) {
        const store = db.createObjectStore(STORE_DOCUMENTS, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─── CRUD operations ──────────────────────────────────────────────────────────

export async function saveDocument(parsed: ParsedDocument): Promise<void> {
  const db = await openDB();
  const now = new Date().toISOString();
  const record: StoredDocument = {
    id: parsed.id,
    filename: parsed.filename,
    charCount: parsed.charCount,
    sectionCount: parsed.sections.length,
    createdAt: now,
    updatedAt: now,
    parsed,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DOCUMENTS, 'readwrite');
    tx.objectStore(STORE_DOCUMENTS).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listDocuments(): Promise<StoredDocument[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DOCUMENTS, 'readonly');
    const req = tx.objectStore(STORE_DOCUMENTS)
      .index('createdAt')
      .getAll();
    req.onsuccess = () => resolve((req.result as StoredDocument[]).reverse());
    req.onerror = () => reject(req.error);
  });
}

export async function getDocument(id: string): Promise<StoredDocument | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DOCUMENTS, 'readonly');
    const req = tx.objectStore(STORE_DOCUMENTS).get(id);
    req.onsuccess = () => resolve(req.result as StoredDocument | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_DOCUMENTS, 'readwrite');
    tx.objectStore(STORE_DOCUMENTS).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
