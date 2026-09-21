'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentInput } from '@/components/features/document-input';
import { useParser } from '@/hooks/use-parser';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { Skeleton } from '@/components/ui/skeleton';
import { IndexCard } from '@/components/ui/index-card';
import { ShieldCheck, Zap, Scale } from 'lucide-react';

export default function DeskPage() {
  const router = useRouter();
  const { status, parse, result } = useParser();
  const { addDocument } = useDocumentLibrary();
  const savedRef = useRef(false);

  const handleSubmit = useCallback((text: string, filename?: string) => {
    savedRef.current = false;
    parse(text, filename);
  }, [parse]);

  // Save result to IndexedDB and navigate — runs only once per new result
  useEffect(() => {
    if (status === 'done' && result && !savedRef.current) {
      savedRef.current = true;
      addDocument(result).then(() => {
        router.push(`/desk/${result.id}`);
      });
    }
  }, [status, result, addDocument, router]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-12">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="font-heading font-semibold text-3xl md:text-4xl text-ink">
          Understand your legal documents.
        </h1>
        <p className="text-base text-ink-muted font-ui max-w-xl mx-auto leading-relaxed">
          Lawesy translates dense contracts into plain language, highlights hidden risks, and tells you what to watch out for — based on your role.
        </p>
      </div>

      {/* Input / Dropzone */}
      <div className="relative">
        <DocumentInput
          onSubmit={handleSubmit}
          isLoading={status === 'parsing'}
        />
        {status === 'parsing' && (
          <div className="absolute inset-0 z-10 bg-paper/90 backdrop-blur-sm rounded-[4px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-sm space-y-3">
              <Skeleton className="h-3 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
              <Skeleton className="h-3 w-2/3 mx-auto" />
              <p className="text-sm font-medium text-accent mt-4">
                Parsing document and identifying clauses…
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Privacy note */}
      <div className="flex items-center justify-center gap-2 text-sm text-risk-low font-ui -mt-6">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>Private &amp; secure — everything stays in your browser until you choose to analyse it.</span>
      </div>

      {/* How it works */}
      <div className="grid md:grid-cols-3 gap-4">
        <IndexCard>
          <div className="flex flex-col gap-3">
            <div className="w-9 h-9 rounded-full bg-desk/20 flex items-center justify-center">
              <span className="font-heading font-semibold text-ink">1</span>
            </div>
            <h3 className="font-heading font-medium text-ink">Drop it on the desk</h3>
            <p className="text-sm text-ink-muted font-ui leading-relaxed">
              Upload a PDF, Word doc, or paste text directly. We instantly segment it into labelled clauses.
            </p>
          </div>
        </IndexCard>

        <IndexCard>
          <div className="flex flex-col gap-3">
            <div className="w-9 h-9 rounded-full bg-desk/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-ink" />
            </div>
            <h3 className="font-heading font-medium text-ink">AI translates it</h3>
            <p className="text-sm text-ink-muted font-ui leading-relaxed">
              Jargon replaced with plain English. A clear summary generated for every section.
            </p>
          </div>
        </IndexCard>

        <IndexCard>
          <div className="flex flex-col gap-3">
            <div className="w-9 h-9 rounded-full bg-desk/20 flex items-center justify-center">
              <Scale className="w-4 h-4 text-ink" />
            </div>
            <h3 className="font-heading font-medium text-ink">Spot the risks</h3>
            <p className="text-sm text-ink-muted font-ui leading-relaxed">
              Checked against your role and jurisdiction to flag unfair obligations and missing protections.
            </p>
          </div>
        </IndexCard>
      </div>
    </div>
  );
}
