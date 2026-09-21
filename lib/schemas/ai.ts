import { z } from 'zod';

export const RoleSchema = z.enum([
  'tenant', 'landlord', 'employee', 'employer', 'freelancer', 
  'small_business', 'consumer', 'notice_recipient', 'other'
]);

export const ExpertiseSchema = z.enum(['new', 'some', 'comfortable']);
export const ReadingLevelSchema = z.enum(['simple', 'standard', 'detailed']);
export const OutputLanguageSchema = z.enum(['en', 'hi', 'ta']);
export const RiskLevelSchema = z.enum(['high', 'medium', 'low', 'info']);
export const DocTypeSchema = z.enum([
  'lease', 'employment', 'nda', 'service_agreement', 'terms_of_service', 
  'privacy_policy', 'loan', 'legal_notice', 'policy', 'other_legal', 'not_legal'
]);
export const GoalSchema = z.enum([
  'understand', 'decide_to_sign', 'negotiate', 'resolve_dispute', 
  'respond_to_notice', 'compare_options'
]);

export const CitationSchema = z.object({
  clauseId: z.string(),
  quote: z.string().max(300).describe('Verbatim quote from the document text'),
});

export const ObligationSchema = z.object({
  who: z.enum(['user', 'other_party', 'both']),
  action: z.string(),
  clauseId: z.string(),
});

export const DeadlineSchema = z.object({
  description: z.string(),
  date: z.string().optional().describe('ISO date string if explicit'),
  relative: z.string().optional().describe('e.g., "30 days after notice"'),
  clauseId: z.string(),
});

export const ClauseAnalysisSchema = z.object({
  clauseId: z.string(),
  title: z.string(),
  category: z.string().describe('e.g., termination, payment, liability'),
  plainSummary: z.string(),
  risk: RiskLevelSchema,
  riskReason: z.string(),
  favorsParty: z.enum(['user', 'other', 'neutral', 'unclear']).optional(),
  obligations: z.array(ObligationSchema),
  deadlines: z.array(DeadlineSchema),
  citations: z.array(CitationSchema),
});

export const DocumentFindingsSchema = z.object({
  clauses: z.array(ClauseAnalysisSchema),
  inconsistencies: z.array(z.object({
    description: z.string(),
    clauseIds: z.array(z.string()),
  })),
  missingProtections: z.array(z.object({
    item: z.string(),
    whyItMatters: z.string(),
  })),
  overallRisk: RiskLevelSchema,
});

export const SummarySchema = z.object({
  oneLine: z.string(),
  keyPoints: z.array(z.string()),
  parties: z.array(z.string()),
  term: z.string().optional(),
  money: z.array(z.string()).optional(),
  citations: z.array(CitationSchema),
});

export const QAAnswerSchema = z.object({
  answer: z.string(),
  citations: z.array(CitationSchema),
  foundInDocument: z.boolean(),
  confidence: z.enum(['high', 'medium', 'low']),
  followUps: z.array(z.string()),
});

export const ClassifierResultSchema = z.object({
  docType: DocTypeSchema,
  confidence: z.number().min(0).max(1),
  sensitiveSignals: z.array(z.string()),
  language: z.string(),
});

export const ClauseComparisonSchema = z.object({
  explanation: z.string(),
  favorsParty: z.enum(['user', 'other', 'neutral', 'unclear']),
  significance: z.enum(['high', 'medium', 'low']),
});

export const ComparisonReportSchema = z.object({
  comparisons: z.array(z.object({
    id: z.string(),
    analysis: ClauseComparisonSchema,
  }))
});

// Infer types for convenience
export type Role = z.infer<typeof RoleSchema>;
export type Expertise = z.infer<typeof ExpertiseSchema>;
export type ReadingLevel = z.infer<typeof ReadingLevelSchema>;
export type OutputLanguage = z.infer<typeof OutputLanguageSchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;
export type DocType = z.infer<typeof DocTypeSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type Citation = z.infer<typeof CitationSchema>;
export type ClauseAnalysis = z.infer<typeof ClauseAnalysisSchema>;
export type DocumentFindings = z.infer<typeof DocumentFindingsSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type QAAnswer = z.infer<typeof QAAnswerSchema>;
export type ClassifierResult = z.infer<typeof ClassifierResultSchema>;
export type ClauseComparison = z.infer<typeof ClauseComparisonSchema>;
export type ComparisonReport = z.infer<typeof ComparisonReportSchema>;
