'use client';

import { Scale, ShieldCheck, Cpu, BookOpen, AlertTriangle } from 'lucide-react';
import { Paper } from '@/components/ui/paper';
import { useI18n } from '@/components/providers/i18n-provider';

const pillars = [
  { icon: ShieldCheck, key: 'privacy' },
  { icon: Cpu, key: 'ai' },
  { icon: BookOpen, key: 'scope' },
  { icon: AlertTriangle, key: 'limits' },
] as const;

export function AboutContent() {
  const { tr } = useI18n();

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <Scale className="w-8 h-8 text-primary" />
        <h1 className="font-heading font-semibold text-3xl text-ink">{tr.about.title}</h1>
      </div>

      <p className="text-base text-ink-muted leading-relaxed font-ui">{tr.about.intro}</p>

      <div className="space-y-4">
        {pillars.map(({ icon: Icon, key }) => (
          <Paper key={key} className="p-6 flex gap-5">
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-ink mb-1">{tr.about[`${key}Title`]}</h2>
              <p className="text-sm text-ink-muted leading-relaxed font-ui">{tr.about[`${key}Body`]}</p>
            </div>
          </Paper>
        ))}
      </div>

      <div className="border border-amber-300 bg-amber-50 rounded p-5 text-sm text-amber-900 leading-relaxed">
        <strong className="font-semibold">{tr.about.disclaimer}</strong> {tr.about.disclaimerBody}
      </div>
    </div>
  );
}
