'use client';

import { useI18n } from '@/components/providers/i18n-provider';

/** Skip-to-content link for screen readers, in the current UI language. */
export function SkipLink() {
  const { tr } = useI18n();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-paper focus:text-ink focus:rounded focus:shadow"
    >
      {tr.skipToContent}
    </a>
  );
}

/** Disclaimer footer shown under every app page. */
export function AppFooter() {
  const { tr } = useI18n();
  return (
    <footer className="px-6 py-3 text-xs text-ink-faint text-center border-t border-paper-line bg-paper/10">
      {tr.disclaimer}
    </footer>
  );
}
