'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { Loader2 } from 'lucide-react';
import { TermHighlighter } from '@/components/features/term-highlighter';
import type { Section } from '@/lib/parser';
import { useI18n } from '@/components/providers/i18n-provider';

interface PlainLanguageSectionProps {
  section: Section;
  index: number;
}

export function PlainLanguageSection({ section, index }: PlainLanguageSectionProps) {
  const { tr } = useI18n();
  const { profile } = useProfile();
  const [plain, setPlain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const language = profile?.outputLanguage || 'en';

  const rawText = section.clauses.map(c => c.rawText).join(' ');

  const handleLoad = async () => {
    if (loaded || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: `S${index}`,
          text: rawText.substring(0, 4000),
          level: 'simple',
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPlain(data.plain);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-paper-line pb-8 last:border-0">
      <div>
        {section.heading && (
          <h3 className="font-heading text-sm text-ink-muted mb-2 uppercase tracking-wide">{section.heading}</h3>
        )}
        <div className="font-body text-sm text-ink-muted opacity-80 leading-relaxed">{rawText}</div>
      </div>
      <div>
        <h3 className="font-heading text-sm text-accent mb-2 uppercase tracking-wide">{tr.plain.heading}</h3>
        {!loaded && !loading ? (
          <button
            onClick={handleLoad}
            className="text-sm text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            {tr.plain.simplifyButton}
          </button>
        ) : loading ? (
          <div className="flex items-center gap-2 text-ink-muted text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            {tr.plain.simplifying}
          </div>
        ) : plain ? (
          <div className="font-body text-base text-ink leading-relaxed bg-accent/5 p-4 rounded border border-accent/10">
            <TermHighlighter text={plain} />
          </div>
        ) : (
          <p className="text-sm text-ink-muted italic">{tr.plain.failed}</p>
        )}
      </div>
    </div>
  );
}
