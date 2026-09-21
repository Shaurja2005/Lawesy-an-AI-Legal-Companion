import { z } from 'zod';
import type { ParsedDocument } from '@/lib/parser';

// ─── DB schema ────────────────────────────────────────────────────────────────

const DB_NAME = 'lawesy-db';
const DB_VERSION = 3; // Bump version for new stores
const STORE_DOCUMENTS = 'documents';
const STORE_ANALYSES = 'analyses';
const STORE_PROFILE = 'profile';
const STORE_CHATS = 'chats';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

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

    req.onupgradeneeded = (e: any) => {
      const db = req.result;
      const oldVersion = e.oldVersion;

      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(STORE_DOCUMENTS)) {
          const store = db.createObjectStore(STORE_DOCUMENTS, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      }

      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(STORE_ANALYSES)) {
          const store = db.createObjectStore(STORE_ANALYSES, { keyPath: 'cacheKey' });
          store.createIndex('docId', 'docId', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_PROFILE)) {
          db.createObjectStore(STORE_PROFILE, { keyPath: 'id' });
        }
      }

      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains(STORE_CHATS)) {
          const store = db.createObjectStore(STORE_CHATS, { keyPath: 'docId' });
        }
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
    // Also delete any analyses associated with this document
    const tx = db.transaction([STORE_DOCUMENTS, STORE_ANALYSES], 'readwrite');
    tx.objectStore(STORE_DOCUMENTS).delete(id);
    
    // Clear analyses for this document by iterating index
    const index = tx.objectStore(STORE_ANALYSES).index('docId');
    const req = index.openCursor(IDBKeyRange.only(id));
    req.onsuccess = (e: any) => {
      const cursor = e.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ─── Cache & Profile operations ───────────────────────────────────────────────

export async function saveAnalysisCache(cacheKey: string, docId: string, data: unknown): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ANALYSES, 'readwrite');
    tx.objectStore(STORE_ANALYSES).put({ cacheKey, docId, data, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAnalysisCache<T>(cacheKey: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_ANALYSES, 'readonly');
    const req = tx.objectStore(STORE_ANALYSES).get(cacheKey);
    req.onsuccess = () => resolve(req.result ? (req.result.data as T) : null);
    req.onerror = () => reject(req.error);
  });
}

export async function saveProfile(profile: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROFILE, 'readwrite');
    // Ensure id is always 'me'
    tx.objectStore(STORE_PROFILE).put({ ...profile, id: 'me', updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getProfile(): Promise<any | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROFILE, 'readonly');
    const req = tx.objectStore(STORE_PROFILE).get('me');
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// ─── Chat operations ──────────────────────────────────────────────────────────

export async function saveChatHistory(docId: string, messages: ChatMessage[]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CHATS, 'readwrite');
    tx.objectStore(STORE_CHATS).put({ docId, messages, updatedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getChatHistory(docId: string): Promise<ChatMessage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CHATS, 'readonly');
    const req = tx.objectStore(STORE_CHATS).get(docId);
    req.onsuccess = () => resolve(req.result ? req.result.messages : []);
    req.onerror = () => reject(req.error);
  });
}

export async function clearChatHistory(docId: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_CHATS, 'readwrite');
    tx.objectStore(STORE_CHATS).delete(docId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

