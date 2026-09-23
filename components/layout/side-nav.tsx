'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Files, GitCompare, Settings, Info } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

const navItems = [
  { href: '/desk', key: 'desk', icon: Files },
  { href: '/compare', key: 'compare', icon: GitCompare },
  { href: '/settings', key: 'settings', icon: Settings },
  { href: '/about', key: 'about', icon: Info },
];

export function SideNav() {
  const { tr } = useI18n();
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 w-56 shrink-0">
      {navItems.map(({ href, key, icon: Icon }) => {
        const label = tr.nav[key];
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'inline-flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm font-ui transition-colors',
              active
                ? 'bg-paper text-ink shadow-[var(--shadow-sheet)] font-medium border-l-2 border-l-brass'
                : 'text-ink-muted hover:text-ink hover:bg-paper/50'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
