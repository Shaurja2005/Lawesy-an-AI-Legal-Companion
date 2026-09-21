'use client';

import type { RiskLevel } from '@/lib/schemas/ai';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export function RiskStamp({ risk }: { risk: RiskLevel }) {
  if (risk === 'high') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase tracking-wider">
        <AlertCircle className="w-3 h-3" /> High Risk
      </span>
    );
  }
  if (risk === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase tracking-wider">
        <AlertTriangle className="w-3 h-3" /> Med Risk
      </span>
    );
  }
  if (risk === 'low') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase tracking-wider">
        <CheckCircle2 className="w-3 h-3" /> Low Risk
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider">
      <Info className="w-3 h-3" /> Info
    </span>
  );
}
