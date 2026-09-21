'use client';

import { useState } from 'react';
import glossaryData from '@/lib/data/glossary.json';

const glossary = glossaryData as Record<string, { definition: string, example: string }>;

interface TermHighlighterProps {
  text: string;
}

export function TermHighlighter({ text }: TermHighlighterProps) {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  // A very simple regex-based term replacement for the MVP.
  // We look for any keys in the glossary.
  const terms = Object.keys(glossary);
  const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');

  const parts = text.split(regex);

  return (
    <span className="relative">
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        if (glossary[lowerPart]) {
          return (
            <span
              key={i}
              className="relative inline-block cursor-help group"
              onMouseEnter={() => setActiveTerm(lowerPart)}
              onMouseLeave={() => setActiveTerm(null)}
            >
              <span className="border-b-2 border-accent/40 bg-accent/10 px-1 rounded hover:bg-accent/20 transition-colors">
                {part}
              </span>
              
              {activeTerm === lowerPart && (
                <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-paper border border-paper-line shadow-lg rounded text-sm">
                  <div className="font-bold text-ink mb-1 capitalize">{part}</div>
                  <div className="text-ink-muted leading-tight mb-2">
                    {glossary[lowerPart].definition}
                  </div>
                  <div className="text-xs text-accent italic">
                    Example: {glossary[lowerPart].example}
                  </div>
                </div>
              )}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
