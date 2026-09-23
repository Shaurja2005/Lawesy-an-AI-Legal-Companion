"use client";

import type { ClauseAnalysis } from '@/lib/schemas/ai';
import { Paper } from '@/components/ui/paper';
import { Button } from '@/components/ui/button';
import { CalendarPlus, CheckCircle2, Circle, Download } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';

export function Checklist({ analyses, loading }: { analyses: ClauseAnalysis[] | null; loading: boolean }) {
  const { tr } = useI18n();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (loading) return <div className="animate-pulse h-32 bg-accent/10 rounded-lg"></div>;
  if (!analyses) return null;

  const obligations = analyses.flatMap(a => 
    (a.obligations || []).map(o => ({ ...o, clauseId: a.clauseId, source: a.title }))
  ).filter(o => o.who === 'user' || o.who === 'both');

  const deadlines = analyses.flatMap(a => 
    (a.deadlines || []).map(d => ({ ...d, clauseId: a.clauseId, source: a.title }))
  );

  const toggle = (id: string) => {
    const newSet = new Set(completed);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCompleted(newSet);
  };

  const generateICS = (deadline: typeof deadlines[0]) => {
    // Generate a simple ICS file for the deadline
    // Since we might not have a hard date, we just set it as an all-day event for today + a reminder in title
    const now = new Date();
    const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dateStr = deadline.date ? new Date(deadline.date).toISOString().replace(/[-:]/g, '').split('T')[0] : now.toISOString().replace(/[-:]/g, '').split('T')[0];
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lawesy//NONSGML v1.0//EN',
      'BEGIN:VEVENT',
      `UID:${crypto.randomUUID()}@lawesy.app`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `SUMMARY:Deadline: ${deadline.description}`,
      `DESCRIPTION:Source: ${deadline.source} (Clause ${deadline.clauseId})\\n\\nRelative: ${deadline.relative || 'N/A'}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deadline-${deadline.clauseId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {obligations.length > 0 && (
        <div>
          <h3 className="font-heading font-semibold text-lg text-ink mb-4">{tr.act.yourObligations}</h3>
          <Paper className="p-0 overflow-hidden divide-y divide-border/50">
            {obligations.map((ob, i) => {
              const id = `ob_${i}`;
              const isDone = completed.has(id);
              return (
                <div key={id} className="flex items-start gap-4 p-4 hover:bg-accent/5 transition-colors">
                  <button onClick={() => toggle(id)} className="mt-1 flex-shrink-0 text-primary">
                    {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-ink-muted" />}
                  </button>
                  <div>
                    <p className={`text-base font-body ${isDone ? 'text-ink-muted line-through' : 'text-ink'}`}>
                      {ob.action}
                    </p>
                    <p className="text-xs text-ink-muted mt-1 uppercase tracking-wider">
                      {ob.source} ({ob.clauseId})
                    </p>
                  </div>
                </div>
              );
            })}
          </Paper>
        </div>
      )}

      {deadlines.length > 0 && (
        <div>
          <h3 className="font-heading font-semibold text-lg text-ink mb-4">{tr.act.deadlines}</h3>
          <Paper className="p-0 overflow-hidden divide-y divide-border/50">
            {deadlines.map((dl, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors">
                <div>
                  <p className="text-base font-body text-ink font-medium">{dl.description}</p>
                  <p className="text-sm text-ink-muted mt-1">
                    {dl.date ? `${tr.act.dateLabel}: ${dl.date}` : dl.relative ? `${tr.act.timeline}: ${dl.relative}` : tr.act.noDate}
                  </p>
                  <p className="text-xs text-ink-muted mt-1 uppercase tracking-wider">
                    {dl.source} ({dl.clauseId})
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => generateICS(dl)} className="gap-2 shrink-0">
                  <CalendarPlus className="w-4 h-4" /> {tr.act.addToCalendar}
                </Button>
              </div>
            ))}
          </Paper>
        </div>
      )}

      {obligations.length === 0 && deadlines.length === 0 && (
        <p className="text-ink-muted italic">{tr.act.noObligations}</p>
      )}
    </div>
  );
}
