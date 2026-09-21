import type { Metadata } from 'next';
import { Fraunces, Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { Toaster } from '@/components/ui/toaster';
import { PreferencesProvider } from '@/components/providers/preferences-provider';

const headingFont = Fraunces({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const bodyFont = Source_Serif_4({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const uiFont = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-ui', display: 'swap' });
const monoFont = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Lawesy',
  description: 'Understand your legal documents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${headingFont.variable} ${bodyFont.variable} ${uiFont.variable} ${monoFont.variable}`}>
      <body className="bg-desk text-ink antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PreferencesProvider>
            {/* Skip-to-content for screen readers */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-paper focus:text-ink focus:rounded focus:shadow"
            >
              Skip to content
            </a>

            {/* Sticky site-wide header */}
            <SiteHeader />

            {/* Route-group layouts (app) and (marketing) render their own wrappers */}
            {children}

            <Toaster />
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
