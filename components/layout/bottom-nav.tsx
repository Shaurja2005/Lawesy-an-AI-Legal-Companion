'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Files, GitCompare, Settings, Info } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

const mobileNavItems = [
  { href: '/desk', key: 'desk', icon: Files },
  { href: '/compare', key: 'compare', icon: GitCompare },
  { href: '/settings', key: 'settings', icon: Settings },
  { href: '/about', key: 'about', icon: Info },
];

export function BottomNav() {
  const { tr } = useI18n();
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 flex justify-around items-center border-t border-paper-line bg-paper py-2 md:hidden"
    >
      {mobileNavItems.map(({ href, key, icon: Icon }) => {
        const label = tr.nav[key];
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 min-w-[44px] min-h-[44px] justify-center text-xs font-ui transition-colors',
              active ? 'text-accent' : 'text-ink-muted hover:text-ink'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
