import type { Metadata } from 'next';
import { business } from './business';

/**
 * Branded Open Graph images (1200×630 PNGs committed to public/og/).
 * Regenerate with `node scripts/generate-og.mjs` after brand/copy changes.
 */
export const ogImages = {
  default: {
    url: '/og/default.png',
    width: 1200,
    height: 630,
    alt: 'RGW Heating & Plumbing, Gas Safe engineers across South Hampshire',
  },
  quote: {
    url: '/og/quote.png',
    width: 1200,
    height: 630,
    alt: 'Get an instant boiler quote from RGW Heating & Plumbing',
  },
  helpAndAdvice: {
    url: '/og/help-and-advice.png',
    width: 1200,
    height: 630,
    alt: 'Heating and plumbing help & advice from RGW Heating & Plumbing',
  },
} as const;

type OpenGraphMeta = NonNullable<Metadata['openGraph']>;

type OpenGraphOverrides = {
  title?: string;
  description?: string;
};

/**
 * Next.js shallow-merges metadata objects: a page that declares `openGraph`
 * replaces the root layout's block entirely (siteName, locale, …), so pages
 * must build theirs from this helper rather than setting `images` alone.
 */
export function pageOpenGraph(
  image: keyof typeof ogImages,
  overrides: OpenGraphOverrides = {}
): OpenGraphMeta {
  return {
    type: 'website',
    siteName: business.name,
    locale: 'en_GB',
    url: './',
    images: [ogImages[image]],
    ...overrides,
  };
}
