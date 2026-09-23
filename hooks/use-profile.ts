'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { getProfile, saveProfile as dbSaveProfile } from '@/lib/db';
import type { Role, Expertise, OutputLanguage, Goal } from '@/lib/schemas/ai';

export interface UserProfile {
  role: Role;
  jurisdiction: { country: string; region?: string };
  goal: Goal;
  expertise: Expertise;
  outputLanguage: OutputLanguage;
  redactPII: boolean;
  isOnboarded: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  role: 'consumer',
  jurisdiction: { country: 'US' },
  goal: 'understand',
  expertise: 'new',
  outputLanguage: 'en',
  redactPII: false,
  isOnboarded: false,
};

// ─── Shared store ────────────────────────────────────────────────────────────
// Every useProfile() caller reads the same state, so a change made anywhere
// (e.g. the header language switcher) is seen everywhere immediately.

type ProfileState = { profile: UserProfile; loading: boolean };

let state: ProfileState = { profile: DEFAULT_PROFILE, loading: true };
let loadStarted = false;
const listeners = new Set<() => void>();
const SERVER_STATE: ProfileState = { profile: DEFAULT_PROFILE, loading: true };

function setState(next: ProfileState) {
  state = next;
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function ensureLoaded() {
  if (loadStarted) return;
  loadStarted = true;
  getProfile()
    .then(p => setState({ profile: (p as UserProfile | null) ?? state.profile, loading: false }))
    .catch(() => setState({ ...state, loading: false }));
}

export function useProfile() {
  const { profile, loading } = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);

  useEffect(ensureLoaded, []);

  const saveProfile = useCallback(async (newProfile: Partial<UserProfile>) => {
    // Merge into the latest shared state, not this component's render snapshot.
    const updated = { ...state.profile, ...newProfile };
    setState({ profile: updated, loading: false });
    await dbSaveProfile(updated);
  }, []);

  return { profile, loading, saveProfile };
}
