'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type Preferences,
  defaultPreferences,
  loadPreferences,
  savePreferences,
} from '@/lib/preferences';

interface PreferencesContextValue {
  preferences: Preferences;
  updatePreferences: (updates: Partial<Preferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextValue>({
  preferences: defaultPreferences,
  updatePreferences: () => {},
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (mounted) setPreferences(loadPreferences());
    });
    return () => { mounted = false; };
  }, []);

  // Apply preferences to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', preferences.highContrast);
    
    const fontSizeMap: Record<Preferences['fontSize'], string> = {
      sm: '15px',
      md: '17px',
      lg: '19px',
      xl: '21px',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[preferences.fontSize]);
  }, [preferences]);

  function updatePreferences(updates: Partial<Preferences>) {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      savePreferences(next);
      return next;
    });
  }

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
