'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Files, GitCompare, Settings, Info } from 'lucide-react';

const navItems = [
  { href: '/desk', label: 'Desk', icon: Files },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/about', label: 'About', icon: Info },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 w-56 shrink-0">
      {navItems.map(({ href, label, icon: Icon }) => {
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
