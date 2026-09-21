'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { getTranslations, SUPPORTED_LANGUAGES, type Translations } from '@/lib/i18n';
import { useProfile } from '@/hooks/use-profile';
import type { OutputLanguage } from '@/lib/schemas/ai';

interface I18nContextValue {
  lang: OutputLanguage;
  tr: Translations;
  setLang: (lang: OutputLanguage) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  tr: getTranslations('en'),
  setLang: async () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { profile, saveProfile, loading } = useProfile();
  const lang = loading ? 'en' : profile.outputLanguage;
  const tr = getTranslations(lang);

  // Update the html[lang] attribute whenever the language changes
  useEffect(() => {
    const htmlEl = document.documentElement;
    const match = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    htmlEl.lang = match?.htmlLang ?? 'en';
  }, [lang]);

  const setLang = async (newLang: OutputLanguage) => {
    await saveProfile({ outputLanguage: newLang });
  };

  return (
    <I18nContext.Provider value={{ lang, tr, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

/** Hook to access the current translations and language switcher */
export function useI18n() {
  return useContext(I18nContext);
}
