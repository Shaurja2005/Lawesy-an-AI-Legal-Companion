import { en } from './en';
import { hi } from './hi';
import { ta } from './ta';
import type { OutputLanguage } from '@/lib/schemas/ai';

export type { Translations } from './en';
export type { OutputLanguage };

export const locales = { en, hi, ta } as const;
export const SUPPORTED_LANGUAGES: { code: OutputLanguage; label: string; nativeLabel: string; htmlLang: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', htmlLang: 'en' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', htmlLang: 'hi' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', htmlLang: 'ta' },
];

/**
 * Return the translations object for the given language.
 * Falls back to English if the locale is unknown.
 */
export function getTranslations(lang: OutputLanguage | string) {
  return locales[lang as OutputLanguage] ?? locales.en;
}

/**
 * Type-safe path resolver for nested translation keys.
 * Usage: t(translations, 'nav.desk')
 */
type NestedKeyOf<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, string>
    ? `${Prefix}${Prefix extends '' ? '' : '.'}${string & K}.${string & keyof T[K]}`
    : `${Prefix}${Prefix extends '' ? '' : '.'}${string & K}`;
}[keyof T];

/** Traverse a nested object by a dot-separated path */
export function t<L extends Record<string, unknown>>(locale: L, path: string): string {
  const parts = path.split('.');
  let current: unknown = locale;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return path;
    current = current[part];
  }
  return typeof current === 'string' ? current : path;
}

/**
 * Check that a locale has no missing keys relative to the reference (en).
 * Returns an array of missing key paths. Empty array = complete.
 */
export function findMissingKeys(
  locale: Record<string, unknown>,
  reference: Record<string, unknown> = en,
  prefix = ''
): string[] {
  const missing: string[] = [];
  for (const key of Object.keys(reference)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (!(key in locale)) {
      missing.push(fullKey);
    } else if (typeof reference[key] === 'object' && reference[key] !== null) {
      missing.push(...findMissingKeys(locale[key] as Record<string, unknown>, reference[key] as Record<string, unknown>, fullKey));
    }
  }
  return missing;
}
