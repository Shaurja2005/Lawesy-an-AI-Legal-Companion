'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { useProfile } from '@/hooks/use-profile';
import type { ParsedDocument } from '@/lib/parser';
import { alignDocuments, AlignedClause } from '@/lib/engine/compare';
import type { ComparisonReport } from '@/lib/schemas/ai';
import { Paper } from '@/components/ui/paper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, GitCompare, Loader2, Minus, Plus, RefreshCcw } from 'lucide-react';

export default function ComparePage({ params }: { params: Promise<{ docId1: string; docId2: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { profile } = useProfile();
  const { documents, loading: docsLoading } = useDocumentLibrary();
  
  const [aligned, setAligned] = useState<AlignedClause[] | null>(null);
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [doc1Name, setDoc1Name] = useState('');
  const [doc2Name, setDoc2Name] = useState('');

  useEffect(() => {
    if (docsLoading) return;

    const doc1 = documents.find(d => d.id === resolvedParams.docId1);
    const doc2 = documents.find(d => d.id === resolvedParams.docId2);

    if (doc1 && doc2) {
      setDoc1Name(doc1.filename ?? 'Document 1');
      setDoc2Name(doc2.filename ?? 'Document 2');
      const alignedClauses = alignDocuments(doc1.parsed as ParsedDocument, doc2.parsed as ParsedDocument);
      setAligned(alignedClauses);
    }
  }, [documents, docsLoading, resolvedParams]);

  useEffect(() => {
    if (!aligned || report || analyzing) return;

    const analyzeDifferences = async () => {
      setAnalyzing(true);
      try {
        const changedPairs = aligned.filter(c => c.changeType === 'changed' || c.changeType === 'added' || c.changeType === 'removed');
        
        // We only send pairs that have some text to compare or explain. For pure additions/removals, we might skip API or handle them, but let's send all changed.
        const pairsToAnalyze = changedPairs.map(c => ({
          id: c.id,
          oldText: c.originalClause?.rawText || '(None)',
          newText: c.newClause?.rawText || '(None)',
        }));

        const res = await fetch('/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: profile?.role,
            pairs: pairsToAnalyze,
          })
        });

        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch (err) {
        console.error("Failed to analyze differences:", err);
      } finally {
        setAnalyzing(false);
      }
    };

    analyzeDifferences();
  }, [aligned, report, analyzing, profile?.role]);

  if (docsLoading || !aligned) {
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

  const getAnalysis = (id: string) => {
    return report?.comparisons.find(c => c.id === id)?.analysis;
  };

  return (
    <div className="max-w-[1400px] mx-auto py-8 relative">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4 gap-2 text-ink-muted">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-3 text-ink mb-2">
            <GitCompare className="w-6 h-6 text-primary" />
            <h1 className="font-heading font-semibold text-2xl">Compare Versions</h1>
          </div>
        </div>
        {analyzing && (
          <div className="flex items-center gap-2 text-ink-muted text-sm bg-accent/5 px-4 py-2 rounded-full border border-accent/20">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            Analyzing legal impact...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document 1 */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg text-ink-muted truncate border-b border-border/50 pb-2">
            Original: {doc1Name}
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
                      (Added in new version)
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
            New: {doc2Name}
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
                        (Removed)
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
                              Favors: {analysis.favorsParty} • Impact: {analysis.significance}
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
