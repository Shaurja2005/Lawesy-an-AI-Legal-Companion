import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-desk-edge bg-desk-edge/80 backdrop-blur-sm"
      aria-label="Site header"
    >
      <Link
        href="/"
        className="font-heading font-semibold text-xl text-ink-on-desk hover:opacity-90 transition-opacity"
        aria-label="Lawesy home"
      >
        Lawesy
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
