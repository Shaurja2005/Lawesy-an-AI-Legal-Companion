import { SideNav } from '@/components/layout/side-nav';
import { BottomNav } from '@/components/layout/bottom-nav';
import { LibraryDrawer } from '@/components/layout/library-drawer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Workspace: sidebar + main content */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">

        {/* ── Desktop sidebar ──────────────────────────────── */}
        <aside
          className="hidden md:flex flex-col w-64 shrink-0 border-r border-paper-line bg-paper/30 sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden"
          aria-label="Sidebar"
        >
          {/* Nav links */}
          <div className="px-3 pt-4 pb-2">
            <SideNav />
          </div>

          {/* Library drawer — grows to fill remaining height */}
          <LibraryDrawer />
        </aside>

        {/* ── Page content ─────────────────────────────────── */}
        <main
          id="main-content"
          className="flex-1 min-w-0 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8"
        >
          {children}
        </main>
      </div>

      {/* Disclaimer footer */}
      <footer className="px-6 py-3 text-xs text-ink-faint text-center border-t border-paper-line bg-paper/10">
        Legal information to help you understand documents — not legal advice.
        For decisions with serious consequences, consult a qualified lawyer.
      </footer>

      {/* ── Mobile bottom nav ────────────────────────────── */}
      <BottomNav />
    </>
  );
}
