'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { OutputLanguage } from '@/lib/schemas/ai';

export function LanguageSwitcher() {
  const { lang, setLang, tr } = useI18n();
  const current = SUPPORTED_LANGUAGES.find(l => l.code === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 px-2 py-1.5 rounded text-ink-muted hover:text-ink hover:bg-paper/20 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={tr.settings.languageSection}
      >
        <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">{current?.nativeLabel ?? 'EN'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {SUPPORTED_LANGUAGES.map(l => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as OutputLanguage)}
            className={lang === l.code ? 'font-semibold text-primary' : ''}
          >
            <span className="mr-2">{l.nativeLabel}</span>
            <span className="text-xs text-ink-muted">{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
