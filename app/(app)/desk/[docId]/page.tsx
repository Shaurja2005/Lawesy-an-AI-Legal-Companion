'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import type { StoredDocument } from '@/lib/db';
import { Paper } from '@/components/ui/paper';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import type { ParsedDocument } from '@/lib/parser';

export default function DocumentViewerPage({ params }: { params: Promise<{ docId: string }> }) {
  const resolvedParams = use(params);
  const { documents, loading } = useDocumentLibrary();
  const [doc, setDoc] = useState<StoredDocument | null>(null);
  
  useEffect(() => {
    if (!loading) {
      const found = documents.find(d => d.id === resolvedParams.docId);
      if (found) setDoc(found);
      else notFound();
    }
  }, [documents, loading, resolvedParams.docId]);

  if (loading || !doc) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <Skeleton className="h-10 w-2/3" />
        <Paper className="p-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
        </Paper>
      </div>
    );
  }

  const parsed = doc.parsed as ParsedDocument;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 text-ink-muted mb-2">
          <FileText className="w-5 h-5" />
          <span className="font-ui text-sm">{doc.filename ?? 'Untitled document'}</span>
        </div>
        <h1 className="font-heading font-semibold text-2xl text-ink">
          {doc.filename ? doc.filename.replace(/\.[^/.]+$/, "") : 'Document Details'}
        </h1>
      </div>

      <Paper variant="lined" padding="lg" className="space-y-8">
        {parsed.sections.map((section) => (
          <div key={`sec-${section.index}`} className="relative">
            {section.heading && (
              <h2 className="font-heading font-semibold text-lg text-ink mb-4 sticky top-14 bg-paper py-2 z-10">
                {section.heading}
              </h2>
            )}
            <div className="space-y-4">
              {section.clauses.map((clause) => (
                <div 
                  key={clause.id} 
                  id={clause.id} 
                  className="relative group scroll-mt-24"
                >
                  <div className="absolute -left-12 top-0 w-10 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={`#${clause.id}`} 
                      className="text-xs font-mono text-ink-muted hover:text-accent"
                      aria-label={`Link to clause ${clause.id}`}
                    >
                      {clause.id}
                    </a>
                  </div>
                  <p className="font-body text-base text-ink leading-relaxed">
                    {clause.rawText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Paper>
    </div>
  );
}
