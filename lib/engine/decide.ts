import type { 
  DocType, 
  ReadingLevel, 
  DocumentFindings, 
  ClassifierResult,
  QAAnswer
} from '../schemas/ai';
import type { UserProfile } from '@/hooks/use-profile';
import { getFocusCategories } from './focus-maps';

export interface SuggestedAction {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface EscalationFlag {
  level: 'urgent' | 'recommended' | 'optional';
  reasons: string[];
  suggestedProfessional: string;
}

export interface EngineDecision {
  readingLevel: ReadingLevel;
  focusCategories: string[];
  autoGlossary: boolean;
  suggestedActions: SuggestedAction[];
  escalation: EscalationFlag | null;
  caveats: string[];
  blocked?: { reason: 'not_legal' | 'unsupported'; message: string };
  infoOnlyMode: boolean; // R5
}

interface EngineInputs {
  profile: UserProfile;
  classifier: ClassifierResult;
  findings?: DocumentFindings;
  sameTypeDocCount?: number;
  lastQA?: QAAnswer;
  charCount?: number;
}

export function decide(inputs: EngineInputs): EngineDecision {
  const { profile, classifier, findings, sameTypeDocCount = 0, lastQA, charCount } = inputs;
  
  const decision: EngineDecision = {
    readingLevel: profile.expertise === 'new' ? 'simple' : profile.expertise === 'some' ? 'standard' : 'detailed',
    focusCategories: getFocusCategories(profile.role, classifier.docType),
    autoGlossary: false,
    suggestedActions: [],
    escalation: null,
    caveats: [],
    infoOnlyMode: false,
  };

  const escalationReasons: string[] = [];
  let escalationLevel: 'urgent' | 'recommended' | 'optional' | null = null;

  const upgradeEscalation = (level: 'urgent' | 'recommended' | 'optional') => {
    if (!escalationLevel) {
      escalationLevel = level;
    } else if (level === 'urgent') {
      escalationLevel = 'urgent';
    } else if (level === 'recommended' && escalationLevel === 'optional') {
      escalationLevel = 'recommended';
    }
  };

  // R1: Expertise = new
  if (profile.expertise === 'new') {
    decision.autoGlossary = true;
  }

  // R7: Jurisdiction missing
  if (!profile.jurisdiction.country || profile.jurisdiction.country === 'unknown') {
    decision.caveats.push('We don’t know your country. Answers will be general, not specific to local laws.');
  }

  // R8: Not legal document
  if (classifier.docType === 'not_legal' && classifier.confidence >= 0.7) {
    decision.blocked = {
      reason: 'not_legal',
      message: 'This does not appear to be a legal document. Lawesy is trained on contracts, policies, and legal notices.',
    };
  }

  // R3: Legal notice
  if (classifier.docType === 'legal_notice' || profile.goal === 'respond_to_notice') {
    upgradeEscalation('recommended');
    escalationReasons.push('Legal notices often require formal, timely responses.');
  }

  // R5: Sensitive domains
  if (classifier.sensitiveSignals && classifier.sensitiveSignals.length > 0) {
    upgradeEscalation('urgent');
    escalationReasons.push(`This document touches on highly sensitive areas: ${classifier.sensitiveSignals.join(', ')}.`);
    decision.infoOnlyMode = true;
  }

  // R11: Parse quality low (assuming >0 chars, if very low, maybe an image PDF)
  if (charCount !== undefined && charCount > 0 && charCount < 200) {
    decision.caveats.push('Very little text was extracted. If this is a scanned document, the analysis may be incomplete.');
  }

  // R9: 2+ documents of same type
  if (sameTypeDocCount >= 2) {
    decision.suggestedActions.push({
      id: 'compare',
      label: 'Compare these documents',
    });
  }

  // R10: Goal = negotiate
  if (profile.goal === 'negotiate' && !decision.infoOnlyMode) {
    decision.suggestedActions.push({
      id: 'find_negotiable',
      label: 'Find negotiable clauses',
    });
  }

  // R12: Low confidence Q&A
  if (lastQA && (!lastQA.foundInDocument || lastQA.confidence === 'low')) {
    decision.suggestedActions.push({
      id: 'ask_lawyer',
      label: 'Ask a professional about this',
    });
  }

  // Dependent on Findings
  if (findings) {
    // R4: Upcoming deadlines
    let hasUpcomingDeadline = false;
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    for (const clause of findings.clauses) {
      for (const deadline of clause.deadlines) {
        if (deadline.date) {
          const deadlineDate = new Date(deadline.date);
          if (deadlineDate > now && deadlineDate <= twoWeeksLater) {
            hasUpcomingDeadline = true;
          }
        }
      }
    }
    
    if (hasUpcomingDeadline) {
      upgradeEscalation('urgent');
      escalationReasons.push('There is a deadline within the next 14 days.');
    }

    // R6: High risk
    const highRiskClauses = findings.clauses.filter(c => c.risk === 'high');
    if (highRiskClauses.length >= 2 || (findings.overallRisk === 'high' && profile.goal === 'decide_to_sign')) {
      upgradeEscalation('recommended');
      escalationReasons.push('Significant risks were detected.');
      decision.suggestedActions.push({
        id: 'prep_brief',
        label: 'Prepare lawyer brief',
      });
    }
  }

  if (escalationLevel) {
    decision.escalation = {
      level: escalationLevel,
      reasons: escalationReasons,
      suggestedProfessional: 'a qualified attorney in your jurisdiction',
    };
  }

  return decision;
}
