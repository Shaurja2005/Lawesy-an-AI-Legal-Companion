import { useCallback, useEffect, useState } from 'react';
import {
  type StoredDocument,
  listDocuments,
  saveDocument,
  deleteDocument,
} from '@/lib/db';
import type { ParsedDocument } from '@/lib/parser';

interface UseDocumentLibraryReturn {
  documents: StoredDocument[];
  loading: boolean;
  error: string | null;
  addDocument: (parsed: ParsedDocument) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDocumentLibrary(): UseDocumentLibraryReturn {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) refresh(); 
    });
    return () => { mounted = false; };
  }, [refresh]);

  const addDocument = useCallback(async (parsed: ParsedDocument) => {
    await saveDocument(parsed);
    await refresh();
  }, [refresh]);

  const removeDocument = useCallback(async (id: string) => {
    await deleteDocument(id);
    await refresh();
  }, [refresh]);

  return { documents, loading, error, addDocument, removeDocument, refresh };
}
