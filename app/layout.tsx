// RGW-015: per-component Mantine CSS instead of the bundled
// @mantine/core/styles.css (~25KB of it was unused on the homepage).
//
// This list is every component actually used anywhere in the app, plus
// every Mantine component those components compose internally, in a
// dependency-safe order. It is not hand-picked - it's the output of
// `node scripts/mantine-css-audit.mjs`, which traces the real (compiled)
// component graph rather than guessing. Re-run that script and diff its
// output against this block whenever a `@mantine/core` import is added,
// removed, or changed anywhere in the app - a mismatch means some
// component is about to render unstyled with no build-time warning.
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles/UnstyledButton.css';
import '@mantine/core/styles/Accordion.css';
import '@mantine/core/styles/CloseButton.css';
import '@mantine/core/styles/Alert.css';
import '@mantine/core/styles/Text.css';
import '@mantine/core/styles/Anchor.css';
import '@mantine/core/styles/Avatar.css';
import '@mantine/core/styles/Badge.css';
import '@mantine/core/styles/Burger.css';
import '@mantine/core/styles/Loader.css';
import '@mantine/core/styles/Button.css';
import '@mantine/core/styles/Paper.css';
import '@mantine/core/styles/Card.css';
import '@mantine/core/styles/Center.css';
import '@mantine/core/styles/CheckboxCard.css';
import '@mantine/core/styles/CheckboxIndicator.css';
import '@mantine/core/styles/Input.css';
import '@mantine/core/styles/InlineInput.css';
import '@mantine/core/styles/Checkbox.css';
import '@mantine/core/styles/Combobox.css';
import '@mantine/core/styles/Container.css';
import '@mantine/core/styles/Divider.css';
import '@mantine/core/styles/Overlay.css';
import '@mantine/core/styles/ModalBase.css';
import '@mantine/core/styles/ScrollArea.css';
import '@mantine/core/styles/Drawer.css';
import '@mantine/core/styles/Flex.css';
import '@mantine/core/styles/FloatingIndicator.css';
import '@mantine/core/styles/Group.css';
import '@mantine/core/styles/Image.css';
import '@mantine/core/styles/List.css';
import '@mantine/core/styles/Progress.css';
import '@mantine/core/styles/SegmentedControl.css';
import '@mantine/core/styles/SimpleGrid.css';
import '@mantine/core/styles/Stack.css';
import '@mantine/core/styles/Table.css';
import '@mantine/core/styles/ThemeIcon.css';
import '@mantine/core/styles/Title.css';
import '@mantine/core/styles/VisuallyHidden.css';
import './globals.css';

import React from 'react';
import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Analytics } from '@/components/Analytics/Analytics';
import { ConsentBanner } from '@/components/ConsentBanner/ConsentBanner';
import { SiteChrome } from '@/components/SiteChrome/SiteChrome';
import { CONSENT_DEFAULT_SNIPPET, isAnalyticsConfigured } from '@/lib/analytics';
import { business } from '@/lib/business';
import { getGoogleReviews } from '@/lib/google-reviews';
import { ogImages } from '@/lib/og';
import { jsonLdScriptProps, localBusinessSchema } from '@/lib/schema';
import { theme } from '../theme';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-figtree',
});

const defaultDescription =
  'Gas Safe registered heating and plumbing engineers in South Hampshire. 24-hour emergency cover.';

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: 'RGW Heating & Plumbing | South Hampshire',
    template: '%s | RGW Heating & Plumbing',
  },
  description: defaultDescription,
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    siteName: business.name,
    locale: 'en_GB',
    url: './',
    images: [ogImages.default],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ratings come from the same cached Places call the homepage uses, so the
  // stars in search results always match the stars on the page.
  const { averageRating, totalRatings } = await getGoogleReviews(0);

  return (
    <html lang="en" className={figtree.variable} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="light" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" sizes="32x32" />
        <script {...jsonLdScriptProps(localBusinessSchema({ averageRating, totalRatings }))} />
        {isAnalyticsConfigured() && (
          // Consent Mode v2 defaults (all denied), must run before any
          // Google tag. gtag.js itself only loads after the visitor accepts
          // analytics (basic consent mode). See docs/measurement-plan.md.

          <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }} />
        )}
      </head>
      <body>
        <MantineProvider theme={theme} forceColorScheme="light">
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
          <VercelAnalytics />
          <ConsentBanner />
        </MantineProvider>
      </body>
    </html>
  );
}
