'use client';

import { GitCompare } from 'lucide-react';
import { Paper } from '@/components/ui/paper';
import { CompareModal } from '@/components/features/compare-modal';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function CompareLandingPage() {
  const { documents, loading } = useDocumentLibrary();

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <GitCompare className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-heading font-semibold text-3xl text-ink">Compare Documents</h1>
          <p className="text-ink-muted text-sm font-ui mt-1">
            Select two documents from your library to compare them side-by-side.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading font-semibold text-lg text-ink">Your Library</h2>
        <p className="text-sm text-ink-muted font-ui">
          Open a document from your desk first, then click <strong>Compare</strong> in the document header to select a
          second version to compare it against.
        </p>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <Paper className="p-8 text-center">
            <p className="text-ink-muted text-sm">
              No documents in your library yet.{' '}
              <Link href="/desk" className="text-primary underline underline-offset-2">
                Upload one on the Desk
              </Link>{' '}
              to get started.
            </p>
          </Paper>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <Paper key={doc.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-ink-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-ink">{doc.filename ?? 'Untitled document'}</p>
                    <p className="text-xs text-ink-muted">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/desk/${doc.id}`}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Open
                  </Link>
                  <CompareModal currentDocId={doc.id} />
                </div>
              </Paper>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
