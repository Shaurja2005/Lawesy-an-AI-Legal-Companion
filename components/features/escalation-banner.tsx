'use client';

import { ShieldAlert, Shield } from 'lucide-react';
import type { EscalationFlag } from '@/lib/engine/decide';

interface EscalationBannerProps {
  escalation: EscalationFlag;
}

export function EscalationBanner({ escalation }: EscalationBannerProps) {
  const isUrgent = escalation.level === 'urgent';
  const isRecommended = escalation.level === 'recommended';

  // Urgent: Red/Orange theme, strictly visible, ARIA alert.
  // Recommended: Amber/Yellow theme.
  // Optional: Blue/Neutral theme.

  let Icon = Shield;
  let bgClass = 'bg-paper-sand';
  let borderClass = 'border-ink-muted';
  let titleClass = 'text-ink';
  let titleText = 'Consider Professional Advice';

  if (isUrgent) {
    Icon = ShieldAlert;
    bgClass = 'bg-red-50';
    borderClass = 'border-red-300';
    titleClass = 'text-red-900';
    titleText = 'Urgent: Legal Professional Recommended';
  } else if (isRecommended) {
    Icon = ShieldAlert;
    bgClass = 'bg-amber-50';
    borderClass = 'border-amber-300';
    titleClass = 'text-amber-900';
    titleText = 'Strongly Consider a Lawyer';
  }

  return (
    <div 
      role={isUrgent ? 'alert' : 'status'} 
      className={`border-l-4 p-4 rounded-r-sm shadow-sm mb-6 ${bgClass} ${borderClass}`}
    >
      <div className="flex gap-4">
        <Icon className={`w-6 h-6 mt-0.5 ${titleClass}`} />
        <div>
          <h4 className={`font-semibold text-lg font-heading ${titleClass}`}>
            {titleText}
          </h4>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-ink-muted">
            {escalation.reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
          {isUrgent && (
            <div className="mt-4 p-3 bg-white bg-opacity-60 rounded border border-red-200">
              <p className="text-sm font-semibold text-red-800 mb-1">Recommended Action:</p>
              <p className="text-sm text-ink-muted">
                Please do not sign or agree to anything before consulting {escalation.suggestedProfessional}. 
                You can use our &quot;Prepare Brief&quot; tool to help your lawyer get up to speed quickly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
