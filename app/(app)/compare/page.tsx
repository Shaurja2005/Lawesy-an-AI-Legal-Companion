'use client';

import { GitCompare } from 'lucide-react';
import { Paper } from '@/components/ui/paper';
import { CompareModal } from '@/components/features/compare-modal';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

export default function CompareLandingPage() {
  const { tr } = useI18n();
  const { documents, loading } = useDocumentLibrary();

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <GitCompare className="w-8 h-8 text-primary" />
        <div>
          <h1 className="font-heading font-semibold text-3xl text-ink">{tr.compare.title}</h1>
          <p className="text-ink-muted text-sm font-ui mt-1">
            {tr.compare.subtitle}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading font-semibold text-lg text-ink">{tr.compare.library}</h2>
        <p className="text-sm text-ink-muted font-ui">
          {tr.compare.instructions}
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
              {tr.compare.noDocuments}{' '}
              <Link href="/desk" className="text-primary underline underline-offset-2">
                {tr.compare.uploadCta}
              </Link>
            </p>
          </Paper>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <Paper key={doc.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-ink-muted shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-ink">{doc.filename ?? tr.common.untitled}</p>
                    <p className="text-xs text-ink-muted">{new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/desk/${doc.id}`}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    {tr.compare.openButton}
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
