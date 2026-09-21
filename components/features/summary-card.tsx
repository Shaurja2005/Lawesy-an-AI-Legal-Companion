'use client';

import { Paper } from '@/components/ui/paper';
import type { Summary } from '@/lib/schemas/ai';

export function SummaryCard({ summary }: { summary: Summary }) {
  return (
    <Paper className="p-6 mb-8 bg-paper border border-paper-line shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-accent opacity-5 rounded-bl-full" />
      
      <h3 className="font-heading text-lg font-bold text-ink mb-2">
        {summary.oneLine}
      </h3>
      
      <div className="flex flex-wrap gap-4 text-sm font-ui text-ink-muted mb-4 pb-4 border-b border-paper-line">
        <div>
          <span className="font-semibold text-ink">Parties:</span> {summary.parties.join(' vs ')}
        </div>
        {summary.term && (
          <div>
            <span className="font-semibold text-ink">Term:</span> {summary.term}
          </div>
        )}
        {summary.money && summary.money.length > 0 && (
          <div>
            <span className="font-semibold text-ink">Financials:</span> {summary.money.join(', ')}
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {summary.keyPoints.map((point, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink items-start">
            <span className="text-accent mt-0.5">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </Paper>
  );
}
