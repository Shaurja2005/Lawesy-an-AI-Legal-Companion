'use client';

import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { useAnalysis } from '@/hooks/use-analysis';
import type { StoredDocument } from '@/lib/db';
import { Paper } from '@/components/ui/paper';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, FileSearch, AlignLeft, ShieldCheck, AlertCircle, MessageSquare } from 'lucide-react';
import type { ParsedDocument } from '@/lib/parser';
import { TypeStamp } from '@/components/features/type-stamp';
import { SummaryCard } from '@/components/features/summary-card';
import { EscalationBanner } from '@/components/features/escalation-banner';
import { RiskStamp } from '@/components/features/risk-stamps';
import { TermHighlighter } from '@/components/features/term-highlighter';
import { ChatPanel } from '@/components/features/chat-panel';
import { CompareModal } from '@/components/features/compare-modal';
import { Checklist } from '@/components/features/checklist';
import { generateMarkdownExport, downloadMarkdown } from '@/lib/export';
import { ListTodo, Download, Printer } from 'lucide-react';
import Link from 'next/link';

export default function DocumentViewerPage({ params }: { params: Promise<{ docId: string }> }) {
  const resolvedParams = use(params);
  const { documents, loading: docsLoading } = useDocumentLibrary();
  const [doc, setDoc] = useState<StoredDocument | null>(null);
  
  useEffect(() => {
    if (!docsLoading) {
      const found = documents.find(d => d.id === resolvedParams.docId);
      if (found) setDoc(found);
      else notFound();
    }
  }, [documents, docsLoading, resolvedParams.docId]);

  const parsed = doc?.parsed as ParsedDocument | undefined;
  
  const { 
    classification, 
    summary, 
    analyses,
    inconsistencies,
    missingProtections, 
    decision, 
    loading: analysisLoading, 
    setClassification 
  } = useAnalysis(resolvedParams.docId, parsed);

  const [activeTab, setActiveTab] = useState<'original' | 'plain' | 'clauses' | 'ask' | 'act'>('original');

  if (docsLoading || !doc || analysisLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Paper className="p-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
        </Paper>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 text-ink-muted mb-2">
            <FileText className="w-5 h-5" />
            <span className="font-ui text-sm">{doc.filename ?? 'Untitled document'}</span>
          </div>
          <h1 className="font-heading font-semibold text-2xl text-ink">
            {doc.filename ? doc.filename.replace(/\.[^/.]+$/, "") : 'Document Details'}
          </h1>
        </div>
        <CompareModal currentDocId={doc.id} />
      </div>

      {decision?.escalation && (
        <EscalationBanner escalation={decision.escalation} />
      )}

      {summary && <SummaryCard summary={summary} />}

      <Paper variant="lined" className="mb-6 relative">
        {classification && (
          <TypeStamp 
            type={classification.docType} 
            confidence={classification.confidence}
            onChange={(t) => setClassification({ ...classification, docType: t })}
          />
        )}
        
        {/* Tabs Header */}
        <div className="flex border-b border-paper-line px-4">
          <button
            onClick={() => setActiveTab('original')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'original' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <AlignLeft className="w-4 h-4" /> Original Text
          </button>
          <button
            onClick={() => setActiveTab('plain')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'plain' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <FileSearch className="w-4 h-4" /> Plain Language
          </button>
          <button
            onClick={() => setActiveTab('clauses')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'clauses' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Key Clauses & Risks
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'ask' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Ask
          </button>
          <button
            onClick={() => setActiveTab('act')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'act' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            <ListTodo className="w-4 h-4" /> Next Steps
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          
          {activeTab === 'original' && (
            <div className="space-y-8">
              {parsed!.sections.map((section) => (
                <div key={`sec-${section.index}`} className="relative">
                  {section.heading && (
                    <h2 className="font-heading font-semibold text-lg text-ink mb-4 sticky top-14 bg-paper py-2 z-10">
                      {section.heading}
                    </h2>
                  )}
                  <div className="space-y-4">
                    {section.clauses.map((clause) => (
                      <div key={clause.id} id={clause.id} className="relative group scroll-mt-24">
                        <div className="absolute -left-12 top-0 w-10 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-mono text-ink-muted">{clause.id}</span>
                        </div>
                        <p className="font-body text-base text-ink leading-relaxed">
                          {clause.rawText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'plain' && (
            <div className="space-y-8">
              {parsed!.sections.map((section) => (
                <div key={`plain-sec-${section.index}`} className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-paper-line pb-8 last:border-0">
                  <div>
                    <h3 className="font-heading text-sm text-ink-muted mb-2 uppercase tracking-wide">Original</h3>
                    <div className="font-body text-sm text-ink-muted opacity-80 leading-relaxed">
                      {section.clauses.map(c => c.rawText).join(' ')}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading text-sm text-accent mb-2 uppercase tracking-wide">Plain English</h3>
                    <div className="font-body text-base text-ink leading-relaxed bg-accent/5 p-4 rounded border border-accent/10">
                      <TermHighlighter text="This section explains the main rules. If you break them, there will be consequences. Force majeure may apply if circumstances are outside your control." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'clauses' && (
            <div className="space-y-8">
              {/* Worth a second look (F28) */}
              {(inconsistencies.length > 0 || missingProtections.length > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded p-6 mb-8">
                  <h3 className="font-heading font-bold text-amber-900 text-lg mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Worth a Second Look
                  </h3>
                  
                  {missingProtections.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2">Missing Protections</h4>
                      <ul className="space-y-2">
                        {missingProtections.map((mp, i) => (
                          <li key={i} className="text-sm text-amber-900">
                            <strong>{mp.item}:</strong> {mp.whyItMatters}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {inconsistencies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2">Contradictory Terms</h4>
                      <ul className="space-y-2">
                        {inconsistencies.map((inc, i) => (
                          <li key={i} className="text-sm text-amber-900">
                            {inc.description} (See clauses: {inc.clauseIds.join(', ')})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Clauses List */}
              <div className="space-y-6">
                {analyses?.length === 0 && (
                  <p className="text-ink-muted italic">No specific clauses highlighted for this document type.</p>
                )}
                {analyses?.map((analysis, i) => (
                  <div key={i} className="border border-paper-line rounded p-5 bg-paper-sand/50">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading font-semibold text-ink text-lg">{analysis.title}</h3>
                      <RiskStamp risk={analysis.risk} />
                    </div>
                    <p className="text-sm font-ui text-ink mb-4">{analysis.plainSummary}</p>
                    
                    {analysis.obligations && analysis.obligations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Obligations</h4>
                        <ul className="space-y-1">
                          {analysis.obligations.map((ob, idx) => (
                            <li key={idx} className="text-sm text-ink flex gap-2">
                              <span className="text-ink-muted">—</span> {ob.action} ({ob.who})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-paper-line">
                      <h4 className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">Source Text ({analysis.clauseId})</h4>
                      <p className="text-sm font-serif italic text-ink-muted pl-4 border-l-2 border-accent/30">
                        "{analysis.citations[0]?.quote || '...'}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ask' && (
            <div className="h-[600px] -mx-8 -my-8 border-l border-paper-line">
               <ChatPanel 
                 document={parsed!} 
                 onClauseClick={(id) => {
                   setActiveTab('original');
                   setTimeout(() => {
                     const el = document.getElementById(id);
                     if (el) {
                       el.scrollIntoView({ behavior: 'smooth' });
                       el.classList.add('bg-accent/10');
                       setTimeout(() => el.classList.remove('bg-accent/10'), 2000);
                     }
                   }, 100);
                 }} 
               />
            </div>
          )}

          {activeTab === 'act' && (
            <div className="space-y-12">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-semibold text-xl text-ink">Action Plan</h2>
                  <div className="flex gap-3">
                    <Link href={`/brief/${doc.id}`} target="_blank">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border/50 rounded-lg hover:bg-accent/5 transition-colors">
                        <Printer className="w-4 h-4" /> Lawyer Brief
                      </button>
                    </Link>
                    <button 
                      onClick={() => {
                        const md = generateMarkdownExport(parsed!, summary, analyses);
                        downloadMarkdown(`analysis-${doc.filename || 'doc'}.md`, md);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border/50 rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <Download className="w-4 h-4" /> Export MD
                    </button>
                  </div>
                </div>
                <Checklist docId={doc.id} parsed={parsed!} />
              </div>
            </div>
          )}

        </div>
      </Paper>
    </div>
  );
}
