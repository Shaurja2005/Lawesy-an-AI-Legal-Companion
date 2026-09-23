'use client';

import { useState, useEffect } from 'react';
import { getAnalysisCache, saveAnalysisCache } from '@/lib/db';
import { useProfile } from './use-profile';
import type { ClassifierResult, Summary, ClauseAnalysis } from '@/lib/schemas/ai';
import type { ParsedDocument } from '@/lib/parser';
import { localClassify } from '@/lib/engine/classifier';
import { decide } from '@/lib/engine/decide';
import { evaluateInconsistencies, evaluateMissingProtections, type MissingProtection } from '@/lib/engine/inconsistencies';

/** POST JSON to an API route; throws with the server's error message on failure. */
async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error?.message ?? `Request to ${url} failed (${res.status})`);
  }
  return res.json();
}

/** Return the cached value for `key`, or fetch it and cache it. Failures are not cached. */
async function cached<T>(key: string, docId: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = await getAnalysisCache<T>(key);
  if (hit) return hit;
  const fresh = await fetcher();
  await saveAnalysisCache(key, docId, fresh);
  return fresh;
}

export function useAnalysis(docId: string, parsed?: ParsedDocument) {
  const { profile, loading: profileLoading } = useProfile();
  const [classification, setClassification] = useState<ClassifierResult | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [analyses, setAnalyses] = useState<ClauseAnalysis[] | null>(null);
  const [inconsistencies, setInconsistencies] = useState<{ description: string; clauseIds: string[] }[]>([]);
  const [missingProtections, setMissingProtections] = useState<MissingProtection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { role, outputLanguage: language, isOnboarded } = profile;
  const country = profile.jurisdiction.country;

  useEffect(() => {
    if (profileLoading || !parsed) return;
    const docData = parsed;
    let mounted = true;

    const rawDocText = docData.sections.map(s => s.clauses.map(c => c.rawText).join(' ')).join('\n');
    const allClauses = docData.sections.flatMap(s => s.clauses.map(c => ({ id: c.id, text: c.rawText })));

    async function runAnalysis() {
      setLoading(true);
      setError(null);
      setSummary(null);
      setAnalyses(null);

      // The three calls are independent, so run them in parallel and show each result as it lands.
      const classifyTask = cached<ClassifierResult>(`class_${docId}_${isOnboarded ? 'v1' : 'v0'}`, docId, () =>
        postJson('/api/classify', { text: rawDocText.substring(0, 10000), language })
      ).catch((e): ClassifierResult => {
        console.error(e);
        // Fall back to the local keyword classifier (not cached, so the AI is retried next time).
        return { docType: localClassify(rawDocText), confidence: 0.5, sensitiveSignals: [], language: 'en' };
      }).then(cRes => {
        if (mounted) setClassification(cRes);
        return cRes;
      });

      const summaryTask = cached<Summary>(`sum_${docId}_${role}_${language}`, docId, () =>
        postJson('/api/summarize', { text: rawDocText.substring(0, 20000), language, focusCategories: [] })
      ).then(sRes => {
        if (mounted) setSummary(sRes);
      });

      const analyzeTask = cached<{ analyses: ClauseAnalysis[] }>(`analyze_${docId}_${role}_${country}_${language}`, docId, () =>
        // The API accepts at most 20 clauses per request
        postJson('/api/analyze', { clauses: allClauses.slice(0, 20), role, jurisdiction: country || 'unknown', language })
      ).then(async aRes => {
        const cRes = await classifyTask;
        if (!mounted) return;
        setAnalyses(aRes.analyses);
        // Run deterministic F28 checks
        setMissingProtections(evaluateMissingProtections(cRes.docType, aRes.analyses));
        setInconsistencies(evaluateInconsistencies(aRes.analyses));
      });

      const results = await Promise.allSettled([summaryTask, analyzeTask]);
      if (!mounted) return;
      const failure = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
      if (failure) {
        console.error(failure.reason);
        setError(failure.reason instanceof Error ? failure.reason.message : String(failure.reason));
      }
      setLoading(false);
    }

    runAnalysis();

    return () => { mounted = false; };
  }, [docId, parsed, profileLoading, role, language, country, isOnboarded]);

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
    error,
    setClassification
  };
}
