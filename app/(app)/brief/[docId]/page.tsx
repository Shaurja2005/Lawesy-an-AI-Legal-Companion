'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentLibrary } from '@/hooks/use-document-library';
import { useAnalysis } from '@/hooks/use-analysis';
import type { ParsedDocument } from '@/lib/parser';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer } from 'lucide-react';

export default function LawyerBriefPage({ params }: { params: Promise<{ docId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { documents, loading: docsLoading } = useDocumentLibrary();
  
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    if (!docsLoading) {
      const found = documents.find(d => d.id === resolvedParams.docId);
      if (found) setDoc(found);
    }
  }, [documents, docsLoading, resolvedParams.docId]);

  const parsed = doc?.parsed as ParsedDocument | undefined;
  
  const { summary, analyses, inconsistencies, missingProtections, decision, loading: analysisLoading } = useAnalysis(resolvedParams.docId, parsed);

  if (docsLoading || analysisLoading || !doc) {
    return <div className="p-8 text-center text-ink-muted">Loading brief...</div>;
  }

  const highRisk = analyses?.filter(a => a.risk === 'high') || [];
  const mediumRisk = analyses?.filter(a => a.risk === 'medium') || [];

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Non-printable header */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-ink-muted">
          <ArrowLeft className="w-4 h-4" /> Back to Desk
        </Button>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="w-4 h-4" /> Print Brief
        </Button>
      </div>

      {/* Printable Area - Legal Memo styling */}
      <div className="bg-white text-black p-12 shadow-sm print:shadow-none print:p-0 font-serif">
        <div className="border-b-2 border-black pb-4 mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-6 text-center">Legal Review Memo</h1>
          
          <div className="grid grid-cols-[100px_1fr] gap-2 text-sm">
            <span className="font-bold uppercase">To:</span>
            <span>Reviewing Attorney</span>
            
            <span className="font-bold uppercase">From:</span>
            <span>Lawesy Automated Review</span>
            
            <span className="font-bold uppercase">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
            
            <span className="font-bold uppercase">Subject:</span>
            <span>Review of {doc.filename || 'Document'}</span>
          </div>
        </div>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">1. Executive Summary</h2>
            <p className="mb-4">{summary?.oneLine}</p>
            {decision?.escalation && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 my-4 font-sans text-sm">
                <strong>URGENT FLAG:</strong> {decision.escalation.reasons.join('; ')}
              </div>
            )}
            <ul className="list-disc pl-5 space-y-2">
              {summary?.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">2. Material Risks & Red Flags</h2>
            {highRisk.length === 0 ? (
              <p className="italic text-gray-600">No high-risk clauses identified.</p>
            ) : (
              <div className="space-y-6">
                {highRisk.map((r, i) => (
                  <div key={i}>
                    <h3 className="font-bold mb-1">{r.title} (Clause {r.clauseId})</h3>
                    <p className="mb-2">{r.riskReason}</p>
                    <blockquote className="border-l-2 border-gray-400 pl-4 py-1 my-2 bg-gray-50 italic text-sm">
                      "{r.citations[0]?.quote}"
                    </blockquote>
                  </div>
                ))}
              </div>
            )}
          </section>

          {(inconsistencies.length > 0 || missingProtections.length > 0) && (
            <section>
              <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">3. Draft Deficiencies</h2>
              
              {missingProtections.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold mb-2">Missing Standard Protections</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {missingProtections.map((mp, i) => (
                      <li key={i}><strong>{mp.item}:</strong> {mp.whyItMatters}</li>
                    ))}
                  </ul>
                </div>
              )}

              {inconsistencies.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Internal Contradictions</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {inconsistencies.map((inc, i) => (
                      <li key={i}>{inc.description} (See: {inc.clauseIds.join(', ')})</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 pb-1 mb-3">4. Client Obligations</h2>
            <ul className="list-disc pl-5 space-y-2">
              {analyses?.flatMap(a => a.obligations || []).filter(o => o.who === 'user').map((o, i) => (
                <li key={i}>{o.action}</li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
