import type { DocType } from '../schemas/ai';

const KEYWORDS: Record<DocType, string[]> = {
  lease: ['tenant', 'landlord', 'rent', 'lease', 'premises', 'security deposit'],
  employment: ['employee', 'employer', 'salary', 'wages', 'employment', 'probation'],
  nda: ['confidential', 'non-disclosure', 'disclosing party', 'receiving party', 'trade secret'],
  service_agreement: ['service provider', 'client', 'statement of work', 'contractor', 'services'],
  terms_of_service: ['terms of service', 'user', 'account', 'platform', 'website', 'acceptable use'],
  privacy_policy: ['privacy', 'data', 'personal information', 'cookies', 'gdpr', 'ccpa'],
  loan: ['lender', 'borrower', 'interest rate', 'principal', 'repayment', 'loan'],
  legal_notice: ['notice', 'demand', 'hereby notified', 'legal action', 'cease and desist'],
  policy: ['policy', 'procedure', 'guidelines', 'company rules'],
  other_legal: ['agreement', 'contract', 'party', 'parties', 'witnesseth'],
  not_legal: [],
};

export function localClassify(text: string): DocType {
  const lower = text.toLowerCase();
  
  // Very naive frequency counter
  const scores: Record<DocType, number> = {
    lease: 0, employment: 0, nda: 0, service_agreement: 0, 
    terms_of_service: 0, privacy_policy: 0, loan: 0, 
    legal_notice: 0, policy: 0, other_legal: 0, not_legal: 0
  };

  let totalMatches = 0;

  for (const [docType, words] of Object.entries(KEYWORDS)) {
    for (const word of words) {
      // Look for the word as a distinct token (roughly)
      if (lower.includes(word)) {
        scores[docType as DocType]++;
        totalMatches++;
      }
    }
  }

  if (totalMatches === 0) return 'not_legal';

  // Find the highest score
  let bestType: DocType = 'other_legal';
  let maxScore = 0;

  for (const [docType, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestType = docType as DocType;
    }
  }

  // Require at least 2 distinct keyword matches to confidently classify, otherwise it might be too generic
  if (maxScore < 2 && bestType !== 'other_legal') {
    return 'other_legal';
  }

  return bestType;
}
