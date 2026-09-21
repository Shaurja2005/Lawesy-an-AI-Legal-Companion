import { z } from 'zod';

export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  reducedMotion: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  fontSize: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
});

export type Preferences = z.infer<typeof preferencesSchema>;

export const defaultPreferences: Preferences = {
  theme: 'system',
  reducedMotion: false,
  highContrast: false,
  fontSize: 'md',
};

const STORAGE_KEY = 'lawesy-preferences';

export function loadPreferences(): Preferences {
  if (typeof window === 'undefined') return defaultPreferences;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPreferences;
    const parsed = preferencesSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(prefs: Preferences): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
