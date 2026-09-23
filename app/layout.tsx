import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Fraunces, Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Sans_Devanagari, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { Toaster } from '@/components/ui/toaster';
import { PreferencesProvider } from '@/components/providers/preferences-provider';
import { I18nProvider } from '@/components/providers/i18n-provider';
import { SkipLink } from '@/components/layout/localized-chrome';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts sends a per-request CSP nonce. Reading headers makes every page render per request,
  // so Next.js can stamp the nonce onto its <script> tags (prerendered pages would ship
  // nonce-less scripts that the CSP blocks). next-themes needs it for its inline script too.
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en" suppressHydrationWarning className={`${headingFont.variable} ${bodyFont.variable} ${uiFont.variable} ${monoFont.variable} ${devanagariFont.variable} ${tamilFont.variable}`}>
      <body className="bg-desk text-ink antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          <PreferencesProvider>
            <I18nProvider>
              {/* Skip-to-content for screen readers */}
              <SkipLink />

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

