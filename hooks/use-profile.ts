'use client';

import { useState, useEffect, useCallback } from 'react';
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

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProfile().then(p => {
      if (mounted) {
        if (p) {
          setProfileState(p);
        }
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const saveProfile = useCallback(async (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfileState(updated);
    await dbSaveProfile(updated);
  }, [profile]);

  return { profile, loading, saveProfile };
}
