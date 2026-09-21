'use client';

import { useState, useEffect } from 'react';
import { getAnalysisCache, saveAnalysisCache } from '@/lib/db';
import { useProfile } from './use-profile';
import type { ClassifierResult, Summary, ClauseAnalysis } from '@/lib/schemas/ai';
import type { ParsedDocument } from '@/lib/parser';
import { localClassify } from '@/lib/engine/classifier';
import { decide } from '@/lib/engine/decide';
import { evaluateInconsistencies, evaluateMissingProtections, type MissingProtection } from '@/lib/engine/inconsistencies';

export function useAnalysis(docId: string, parsed?: ParsedDocument) {
  const { profile, loading: profileLoading } = useProfile();
  const [classification, setClassification] = useState<ClassifierResult | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [analyses, setAnalyses] = useState<ClauseAnalysis[] | null>(null);
  const [inconsistencies, setInconsistencies] = useState<{ description: string; clauseIds: string[] }[]>([]);
  const [missingProtections, setMissingProtections] = useState<MissingProtection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileLoading || !parsed) return;
    const docData = parsed;

    let mounted = true;

    async function runAnalysis() {
      if (mounted) setLoading(true);
      // 1. Classification
      const classCacheKey = `class_${docId}_${profile.isOnboarded ? 'v1' : 'v0'}`;
      let cRes = await getAnalysisCache<ClassifierResult>(classCacheKey);
      
      if (!cRes) {
        try {
          const rawDocText = docData.sections.map(s => s.clauses.map(c => c.rawText).join(' ')).join('\n');
          const snippet = rawDocText.substring(0, 10000);
          
          const res = await fetch('/api/classify', {
            method: 'POST',
            body: JSON.stringify({ text: snippet, language: profile.outputLanguage }),
          });
          if (res.ok) {
            cRes = await res.json();
            await saveAnalysisCache(classCacheKey, docId, cRes);
          } else {
            throw new Error('API failed');
          }
        } catch (e) {
          console.error(e);
          // Fallback to local
          const rawDocText = docData.sections.map(s => s.clauses.map(c => c.rawText).join(' ')).join('\n');
          cRes = {
            docType: localClassify(rawDocText),
            confidence: 0.5,
            sensitiveSignals: [],
            language: 'en'
          };
        }
      }
      
      if (mounted) setClassification(cRes);

      // 2. Summarize
      const sumCacheKey = `sum_${docId}_${profile.role}_${profile.outputLanguage}`;
      let sRes = await getAnalysisCache<Summary>(sumCacheKey);

      if (!sRes) {
        try {
          const rawDocText = docData.sections.map(s => s.clauses.map(c => c.rawText).join(' ')).join('\n');
          const res = await fetch('/api/summarize', {
            method: 'POST',
            body: JSON.stringify({ text: rawDocText.substring(0, 20000), language: profile.outputLanguage, focusCategories: [] }),
          });
          if (res.ok) {
            sRes = await res.json();
            await saveAnalysisCache(sumCacheKey, docId, sRes);
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (mounted) setSummary(sRes);

      // 3. Analyze Clauses
      const analyzeCacheKey = `analyze_${docId}_${profile.role}_${profile.jurisdiction.country}`;
      let aRes = await getAnalysisCache<{ analyses: ClauseAnalysis[] }>(analyzeCacheKey);

      if (!aRes) {
        try {
          // Flatten clauses
          const allClauses = docData.sections.flatMap(s => s.clauses.map(c => ({ id: c.id, text: c.rawText })));
          // Send first 20 for MVP mock
          const res = await fetch('/api/analyze', {
            method: 'POST',
            body: JSON.stringify({ 
              clauses: allClauses.slice(0, 20),
              role: profile.role,
              jurisdiction: profile.jurisdiction.country || 'unknown',
              language: profile.outputLanguage
            }),
          });
          if (res.ok) {
            aRes = await res.json();
            await saveAnalysisCache(analyzeCacheKey, docId, aRes);
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (mounted) {
        if (aRes) {
          setAnalyses(aRes.analyses);
          // Run deterministic F28 checks
          if (cRes) {
            setMissingProtections(evaluateMissingProtections(cRes.docType, aRes.analyses));
          }
          setInconsistencies(evaluateInconsistencies(aRes.analyses));
        }
        setLoading(false);
      }
    }

    runAnalysis();

    return () => { mounted = false; };
  }, [docId, parsed, profileLoading, profile]);

  const decision = (profile && classification) 
    ? decide({ 
        profile, 
        classifier: classification, 
        findings: analyses ? { clauses: analyses, overallRisk: 'low', inconsistencies, missingProtections } : undefined 
      }) 
    : null;

  return { 
    classification, 
    summary, 
    analyses, 
    inconsistencies,
    missingProtections,
    decision, 
    loading, 
    setClassification 
  };
}

