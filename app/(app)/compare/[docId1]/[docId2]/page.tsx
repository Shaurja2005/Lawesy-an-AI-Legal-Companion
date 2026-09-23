'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { useProfile } from '@/hooks/use-profile';
import { useI18n } from '@/components/providers/i18n-provider';
import type { ParsedDocument } from '@/lib/parser';
import { alignDocuments } from '@/lib/engine/compare';
import type { ComparisonReport } from '@/lib/schemas/ai';
import { Paper } from '@/components/ui/paper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, GitCompare, Loader2, Minus, Plus, RefreshCcw } from 'lucide-react';

/** Max changed clause pairs sent to the AI in one request (keeps latency and token use bounded). */
const MAX_PAIRS = 25;
/** Max characters per clause text sent to the AI. */
const MAX_CLAUSE_CHARS = 1500;

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function ComparePage({ params }: { params: Promise<{ docId1: string; docId2: string }> }) {
  const { docId1, docId2 } = use(params);
  const router = useRouter();
  const { tr } = useI18n();
  const { profile, loading: profileLoading } = useProfile();
  const { documents, loading: docsLoading } = useDocumentLibrary();

  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const doc1 = documents.find(d => d.id === docId1);
  const doc2 = documents.find(d => d.id === docId2);

  // Align once per document pair; `documents` gets a new identity whenever the library refreshes.
  const aligned = useMemo(
    () => (doc1 && doc2 ? alignDocuments(doc1.parsed as ParsedDocument, doc2.parsed as ParsedDocument) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [doc1?.id, doc2?.id],
  );

  const changedPairs = useMemo(
    () => (aligned ?? []).filter(c => c.changeType !== 'same'),
    [aligned],
  );

  const role = profile.role;
  const language = profile.outputLanguage;

  // Runs once per (documents, role, language, retry) — never re-fires on its own after a failure.
  useEffect(() => {
    if (!aligned || profileLoading) return;
    if (changedPairs.length === 0) {
      setReport({ comparisons: [] });
      setStatus('done');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    setErrorMessage(null);
    setReport(null);

    const pairs = changedPairs.slice(0, MAX_PAIRS).map(c => ({
      id: c.id,
      oldText: (c.originalClause?.rawText || '(None)').slice(0, MAX_CLAUSE_CHARS),
      newText: (c.newClause?.rawText || '(None)').slice(0, MAX_CLAUSE_CHARS),
    }));

    fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, language, pairs }),
      signal: controller.signal,
    })
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error?.message ?? `Request failed (${res.status})`);
        setReport(data as ComparisonReport);
        setStatus('done');
      })
      .catch(err => {
        if (controller.signal.aborted) return;
        console.error('Failed to analyze differences:', err);
        setErrorMessage(err instanceof Error ? err.message : String(err));
        setStatus('error');
      });

    return () => controller.abort();
  }, [aligned, changedPairs, profileLoading, role, language, attempt]);

  if (docsLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-8">
          <Paper className="h-96"><Skeleton className="h-full w-full opacity-50" /></Paper>
          <Paper className="h-96"><Skeleton className="h-full w-full opacity-50" /></Paper>
        </div>
      </div>
    );
  }

  if (!doc1 || !doc2 || !aligned) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-ink-muted">{tr.compare.notFound}</p>
        <Button variant="secondary" onClick={() => router.push('/compare')}>{tr.common.back}</Button>
      </div>
    );
  }

  const getAnalysis = (id: string) => report?.comparisons.find(c => c.id === id)?.analysis;

  const favorsLabel = (party: string) =>
    party === 'user' ? tr.compare.favorsUser
    : party === 'other' ? tr.compare.favorsOther
    : party === 'neutral' ? tr.compare.neutral
    : tr.compare.unclear;

  const significanceLabel = (sig: string) =>
    sig === 'high' ? tr.compare.sigHigh : sig === 'medium' ? tr.compare.sigMedium : tr.compare.sigLow;

  return (
    <div className="max-w-[1400px] mx-auto py-8 relative">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4 gap-2 text-ink-muted">
            <ArrowLeft className="w-4 h-4" /> {tr.common.back}
          </Button>
          <div className="flex items-center gap-3 text-ink mb-2">
            <GitCompare className="w-6 h-6 text-primary" />
            <h1 className="font-heading font-semibold text-2xl">{tr.compare.versionsTitle}</h1>
          </div>
        </div>
        {status === 'loading' && (
          <div role="status" className="flex items-center gap-2 text-ink-muted text-sm bg-accent/5 px-4 py-2 rounded-full border border-accent/20">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            {tr.compare.analyzing}
          </div>
        )}
      </div>

      {status === 'error' && (
        <div role="alert" className="mb-6 border-l-4 border-risk-high bg-paper p-4 text-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-ink">{tr.compare.failed}</p>
            {errorMessage && <p className="text-ink-muted mt-1">{errorMessage}</p>}
          </div>
          <Button variant="secondary" size="sm" onClick={() => setAttempt(a => a + 1)} className="gap-2">
            <RefreshCcw className="w-4 h-4" /> {tr.compare.retry}
          </Button>
        </div>
      )}

      {changedPairs.length === 0 && (
        <p className="mb-6 text-ink-muted italic">{tr.compare.identical}</p>
      )}

      {changedPairs.length > MAX_PAIRS && (
        <p className="mb-6 text-sm text-ink-muted">{tr.compare.truncated.replace('{n}', String(MAX_PAIRS))}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document 1 */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg text-ink-muted truncate border-b border-border/50 pb-2">
            {tr.compare.originalDoc}: {doc1.filename ?? tr.common.untitled}
          </h2>
          <Paper variant="lined" className="p-8">
            <div className="space-y-8">
              {aligned.map((pair) => (
                <div key={`${pair.id}_1`} className={`relative min-h-[4rem] transition-colors p-4 -mx-4 rounded-lg ${
                  pair.changeType === 'removed' ? 'bg-red-500/5' :
                  pair.changeType === 'changed' ? 'bg-amber-500/5' : ''
                }`}>
                  {pair.originalClause ? (
                    <p className={`font-body text-base leading-relaxed ${pair.changeType === 'removed' ? 'line-through text-ink-muted opacity-60' : 'text-ink'}`}>
                      {pair.originalClause.rawText}
                    </p>
                  ) : (
                    <div className="flex items-center justify-center h-full text-ink-muted italic opacity-50 text-sm">
                      {tr.compare.addedClause}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Paper>
        </div>

        {/* Document 2 */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg text-ink truncate border-b border-border/50 pb-2">
            {tr.compare.newDoc}: {doc2.filename ?? tr.common.untitled}
          </h2>
          <Paper variant="lined" className="p-8">
            <div className="space-y-8">
              {aligned.map((pair) => {
                const analysis = getAnalysis(pair.id);

                return (
                  <div key={`${pair.id}_2`} className={`relative min-h-[4rem] transition-colors p-4 -mx-4 rounded-lg ${
                    pair.changeType === 'added' ? 'bg-green-500/5 border border-green-500/20' :
                    pair.changeType === 'changed' ? 'bg-amber-500/5 border border-amber-500/20' : ''
                  }`}>
                    {pair.newClause ? (
                      <p className={`font-body text-base leading-relaxed text-ink`}>
                        {pair.newClause.rawText}
                      </p>
                    ) : (
                      <div className="flex items-center justify-center h-full text-ink-muted italic opacity-50 text-sm">
                        {tr.compare.removedClause}
                      </div>
                    )}

                    {analysis && (
                      <div className="mt-4 pt-3 border-t border-border/30">
                        <div className="flex items-start gap-2">
                          <div className={`p-1.5 rounded-full mt-0.5 ${
                            analysis.favorsParty === 'user' ? 'bg-green-500/20 text-green-700' :
                            analysis.favorsParty === 'other' ? 'bg-red-500/20 text-red-700' :
                            'bg-slate-500/20 text-slate-700'
                          }`}>
                            {analysis.favorsParty === 'user' ? <Plus className="w-3 h-3" /> :
                             analysis.favorsParty === 'other' ? <Minus className="w-3 h-3" /> :
                             <RefreshCcw className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className="text-sm text-ink font-medium leading-tight mb-1">
                              {analysis.explanation}
                            </p>
                            <p className="text-xs text-ink-muted uppercase tracking-wider font-semibold">
                              {tr.compare.favors}: {favorsLabel(analysis.favorsParty)} • {tr.compare.impact}: {significanceLabel(analysis.significance)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}
