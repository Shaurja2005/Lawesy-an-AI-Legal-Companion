'use client';

import { useState } from 'react';
import type { DocType } from '@/lib/schemas/ai';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface TypeStampProps {
  type: DocType;
  confidence: number;
  onChange: (newType: DocType) => void;
}

const TYPE_LABELS: Record<DocType, string> = {
  lease: 'LEASE AGREEMENT',
  employment: 'EMPLOYMENT CONTRACT',
  nda: 'NON-DISCLOSURE AGREEMENT',
  service_agreement: 'SERVICE AGREEMENT',
  terms_of_service: 'TERMS OF SERVICE',
  privacy_policy: 'PRIVACY POLICY',
  loan: 'LOAN AGREEMENT',
  legal_notice: 'LEGAL NOTICE',
  policy: 'COMPANY POLICY',
  other_legal: 'LEGAL DOCUMENT',
  not_legal: 'NOT A LEGAL DOCUMENT',
};

export function TypeStamp({ type, confidence, onChange }: TypeStampProps) {
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
            {Object.entries(TYPE_LABELS).map(([val, label]) => (
              <SelectItem key={val} value={val}>{label}</SelectItem>
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
      title="Click to change document type"
    >
      <div className="px-3 py-1 border-2 border-red-500/80 text-red-600/90 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-paper rounded shadow-sm opacity-80 group-hover:opacity-100 transition-opacity transform rotate-1">
        {TYPE_LABELS[type] || TYPE_LABELS.other_legal}
        {confidence < 0.7 && type !== 'not_legal' && (
          <span className="block text-[8px] text-red-400/80 mt-0.5 lowercase tracking-normal">
            (low confidence)
          </span>
        )}
      </div>
    </div>
  );
}
