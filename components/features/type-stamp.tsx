'use client';

import { useState } from 'react';
import type { DocType } from '@/lib/schemas/ai';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useI18n } from '@/components/providers/i18n-provider';

interface TypeStampProps {
  type: DocType;
  confidence: number;
  onChange: (newType: DocType) => void;
}

const DOC_TYPES: DocType[] = [
  'lease', 'employment', 'nda', 'service_agreement', 'terms_of_service',
  'privacy_policy', 'loan', 'legal_notice', 'policy', 'other_legal', 'not_legal',
];

export function TypeStamp({ type, confidence, onChange }: TypeStampProps) {
  const { tr } = useI18n();
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="absolute top-4 right-4 z-10 w-48">
        <Select 
          value={type} 
          onValueChange={(val) => {
            onChange(val as DocType);
            setEditing(false);
          }}
        >
          <SelectTrigger className="w-full text-xs font-mono uppercase border-red-200" onBlur={() => setEditing(false)} autoFocus>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOC_TYPES.map(val => (
              <SelectItem key={val} value={val}>{tr.docTypes[val]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div 
      className="absolute top-4 right-4 z-10 cursor-pointer group"
      onClick={() => setEditing(true)}
      title={tr.docTypes.changeType}
    >
      <div className="px-3 py-1 border-2 border-red-500/80 text-red-600/90 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-paper rounded shadow-sm opacity-80 group-hover:opacity-100 transition-opacity transform rotate-1">
        {tr.docTypes[type] ?? tr.docTypes.other_legal}
        {confidence < 0.7 && type !== 'not_legal' && (
          <span className="block text-[8px] text-red-400/80 mt-0.5 lowercase tracking-normal">
            {tr.docTypes.lowConfidence}
          </span>
        )}
      </div>
    </div>
  );
}
