import type { Metadata } from 'next';
import { Fraunces, Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Sans_Devanagari, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { Toaster } from '@/components/ui/toaster';
import { PreferencesProvider } from '@/components/providers/preferences-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';

const headingFont = Fraunces({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });
const bodyFont = Source_Serif_4({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const uiFont = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-ui', display: 'swap' });
const monoFont = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
// Indian script fonts — loaded via next/font (self-hosted) for Devanagari (Hindi) and Tamil
const devanagariFont = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '500', '600'], variable: '--font-devanagari', display: 'swap' });
const tamilFont = Noto_Sans_Tamil({ subsets: ['tamil'], weight: ['400', '500', '600'], variable: '--font-tamil', display: 'swap' });

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
    <html lang="en" suppressHydrationWarning className={`${headingFont.variable} ${bodyFont.variable} ${uiFont.variable} ${monoFont.variable} ${devanagariFont.variable} ${tamilFont.variable}`}>
      <body className="bg-desk text-ink antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PreferencesProvider>
            <I18nProvider>
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
            </I18nProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

