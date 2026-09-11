import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// RGW-112: no nonce — nonces require every page to opt into dynamic
// rendering (see next's content-security-policy guide), which would drop
// the static/ISR rendering this site relies on for its town and service
// pages. 'unsafe-inline' on script/style is the tradeoff for keeping
// static generation; still closes the "no CSP at all" gap.
// Origins: googletagmanager.com (GA loader, lib/analytics.ts), quotedirect.uk
// (QuoteFunnel/boiler-size fetch quote-direct's API directly from the
// browser — dropping this breaks the funnel), cdn.sanity.io (article
// images). Vercel Analytics and Speed Insights are same-origin
// (/_vercel/insights/*), already covered by 'self'.
//
// /studio gets its own, separate policy below, not this one. Its embedded
// Sanity Studio calls Sanity's own API/realtime hosts directly from the
// browser, and applying this policy there broke it outright ("Couldn't
// reach the Sanity servers", caught on the first RGW-112 preview).
// Enumerating Sanity's exact origins was tried and abandoned: round one
// (api.sanity.io, apicdn.sanity.io, *.sanity.io + wss://) still broke —
// round two's console trace turned up a second domain entirely,
// sanity-cdn.com, needed across three more directives (core.sanity-cdn.com
// for script-src, the sanity-cdn.com apex for connect-src,
// design-system-static.sanity.io for font-src) plus avatars.githubusercontent.com
// for img-src. Studio's origin list is Sanity's to change, not this repo's,
// so pinning it would break publishing silently on the next Studio upgrade
// — the same failure mode twice in two rounds. /studio is editor-only,
// noindex, disallowed in robots.txt and sits behind Sanity's own hosted
// auth, so the public surface keeps the strict policy while the admin
// surface goes permissive on origins entirely (script/style/img/font/
// connect all open to `https:`/`wss:`) and keeps only the directives that
// still mean something on an authenticated admin SPA: no plugins
// (object-src), no framing (frame-ancestors), no base-tag hijack
// (base-uri), no cross-origin form posts (form-action).
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.sanity.io https://www.google-analytics.com;
  font-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://quotedirect.uk;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

// Studio-only, permissive on origins: same hard directives as the public
// policy (object-src, base-uri, frame-ancestors, form-action) but every
// origin-bearing directive opens to https:/wss: rather than an enumerated
// allowlist — see the reasoning above. 'unsafe-eval' is added here only;
// the public policy still doesn't have it and shouldn't.
const studioCspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
  style-src 'self' 'unsafe-inline' https:;
  img-src 'self' data: blob: https:;
  font-src 'self' data: https:;
  connect-src 'self' https: wss:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const baseSecurityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Vercel already sends HSTS; this extends it (RGW-112, security audit #3).
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const securityHeaders = [
  ...baseSecurityHeaders,
  { key: 'Content-Security-Policy', value: cspHeader },
];

const studioSecurityHeaders = [
  ...baseSecurityHeaders,
  { key: 'Content-Security-Policy', value: studioCspHeader },
];

const config = {
  reactStrictMode: true,
  // @portabletext/react (and its @portabletext/toolkit dependency) ship
  // ESM-only. Listing them here is also what lets next/jest transform them
  // instead of skipping all of node_modules, needed once RGW-017 started
  // rendering drafted article bodies through PortableText in tests — see
  // content/help-articles/__tests__ and lib/portableTextBlockComponents.tsx.
  // @portabletext/to-html (RGW-028, third attempt — lib/renderArticleBodyHtml.ts)
  // is ESM-only for the same reason and needs the same treatment.
  transpilePackages: ['@portabletext/react', '@portabletext/toolkit', '@portabletext/to-html'],
  // RGW-016: default is webp-only; AVIF is ~20% smaller for photos (the hero
  // background, PhotoBand images, article covers) and is preferred first for
  // browsers that support it, directly cutting LCP image bytes on mobile.
  images: {
    formats: ['image/avif', 'image/webp'],
    // RGW-080: article cover images and inline article images are Sanity
    // assets served from cdn.sanity.io. next/image refuses any remote host
    // that is not listed here, so without this entry the first article an
    // editor publishes with a cover image 500s at render time. Scoped to this
    // project's own asset path so no other Sanity project's images qualify.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'lwny3nj5'}/**`,
      },
    ],
  },
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  // Legacy URLs from the OLD Framer site (captured from its live sitemap.xml on
  // 2026-07-07 — see docs/cutover-plan.md). None of these paths exist on the new
  // site, so the redirects are inert until the domain cutover, and 301s from day
  // one afterwards. Specific mappings first; the /collection/:slug catch-all
  // sweeps the remaining old blog posts to the Help & advice hub — upgrade any
  // of them to a specific article once a matching Sanity post exists.
  async headers() {
    return [
      // /studio (and everything under it, app/studio/[[...tool]]) gets its
      // own policy below — the negative lookahead excludes it here so the
      // two never both match the same request.
      { source: '/((?!studio).*)', headers: securityHeaders },
      { source: '/studio/:path*', headers: studioSecurityHeaders },
    ];
  },
  async redirects() {
    return [
      // Internal renames: /service-areas → /where-we-work → /areas-we-cover.
      { source: '/service-areas', destination: '/areas-we-cover', permanent: true },
      { source: '/where-we-work', destination: '/areas-we-cover', permanent: true },
      { source: '/quoting-tool', destination: '/get-a-quote', permanent: true },
      { source: '/collection/quotes', destination: '/get-a-quote', permanent: true },
      {
        source: '/collection/what-is-powerflushing',
        destination: '/what-we-do/powerflushing',
        permanent: true,
      },
      {
        source: '/collection/boiler-repair-or-replace',
        destination: '/what-we-do/boiler-services',
        permanent: true,
      },
      // RGW-056: two more legacy /collection URLs still shown in Search
      // Console, mapped to the help articles that actually cover them
      // instead of falling through the catch-all to the generic hub.
      {
        source: '/collection/combi-or-condense',
        destination: '/help-and-advice/combi-vs-system-boiler',
        permanent: true,
      },
      {
        source: '/collection/samrt-thermostats',
        destination: '/help-and-advice/smart-thermostats',
        permanent: true,
      },
      // RGW-054: /collection/boiler-kw-calculator is a real page again (the
      // old site's most-shown URL in Google's AI features and web search), so
      // the catch-all below must not swallow it. Next.js runs redirects before
      // the filesystem, so a page at that path is not enough on its own; the
      // negative lookahead carves it out. Add any further revived /collection
      // page to the same alternation.
      {
        source: '/collection/:slug((?!boiler-kw-calculator$).*)',
        destination: '/help-and-advice',
        permanent: true,
      },

      // RGW-026: all 43 `/[landing]` town/service pages consolidated into
      // 10 `/areas/<town>` pages with genuinely distinct content, per town,
      // instead of a shared template with the name substituted in — see
      // content/town-pages.ts and that ticket for the full reasoning.
      // Permanent (301s), so whatever ranking authority the old URLs had
      // transfers rather than being thrown away on a 404. Keep this list in
      // sync with each town's `oldSlugs` in content/town-pages.ts by hand —
      // this file can't import that TS module.
      { source: '/new-boiler-eastleigh', destination: '/areas/eastleigh', permanent: true },
      { source: '/boiler-service-eastleigh', destination: '/areas/eastleigh', permanent: true },
      { source: '/emergency-plumber-eastleigh', destination: '/areas/eastleigh', permanent: true },
      { source: '/new-boiler-allbrook', destination: '/areas/eastleigh', permanent: true },

      { source: '/new-boiler-bishopstoke', destination: '/areas/bishopstoke', permanent: true },
      { source: '/boiler-service-bishopstoke', destination: '/areas/bishopstoke', permanent: true },
      {
        source: '/emergency-plumber-bishopstoke',
        destination: '/areas/bishopstoke',
        permanent: true,
      },

      {
        source: '/new-boiler-chandlers-ford',
        destination: '/areas/chandlers-ford',
        permanent: true,
      },
      {
        source: '/boiler-service-chandlers-ford',
        destination: '/areas/chandlers-ford',
        permanent: true,
      },
      {
        source: '/emergency-plumber-chandlers-ford',
        destination: '/areas/chandlers-ford',
        permanent: true,
      },
      { source: '/new-boiler-hiltingbury', destination: '/areas/chandlers-ford', permanent: true },

      { source: '/new-boiler-fair-oak', destination: '/areas/fair-oak', permanent: true },
      { source: '/new-boiler-horton-heath', destination: '/areas/fair-oak', permanent: true },

      { source: '/new-boiler-hedge-end', destination: '/areas/hedge-end', permanent: true },
      { source: '/boiler-service-hedge-end', destination: '/areas/hedge-end', permanent: true },
      {
        source: '/emergency-plumber-hedge-end',
        destination: '/areas/hedge-end',
        permanent: true,
      },
      { source: '/new-boiler-boorley-green', destination: '/areas/hedge-end', permanent: true },

      { source: '/new-boiler-winchester', destination: '/areas/winchester', permanent: true },
      { source: '/boiler-service-winchester', destination: '/areas/winchester', permanent: true },
      {
        source: '/emergency-plumber-winchester',
        destination: '/areas/winchester',
        permanent: true,
      },
      { source: '/new-boiler-compton', destination: '/areas/winchester', permanent: true },
      { source: '/new-boiler-twyford', destination: '/areas/winchester', permanent: true },
      { source: '/new-boiler-otterbourne', destination: '/areas/winchester', permanent: true },
      { source: '/new-boiler-hockley', destination: '/areas/winchester', permanent: true },
      { source: '/new-boiler-owslebury', destination: '/areas/winchester', permanent: true },
      { source: '/new-boiler-colden-common', destination: '/areas/winchester', permanent: true },
      { source: '/new-boiler-alresford', destination: '/areas/winchester', permanent: true },

      { source: '/new-boiler-southampton', destination: '/areas/southampton', permanent: true },
      {
        source: '/boiler-service-southampton',
        destination: '/areas/southampton',
        permanent: true,
      },
      {
        source: '/emergency-plumber-southampton',
        destination: '/areas/southampton',
        permanent: true,
      },

      { source: '/new-boiler-romsey', destination: '/areas/romsey', permanent: true },
      { source: '/boiler-service-romsey', destination: '/areas/romsey', permanent: true },
      { source: '/emergency-plumber-romsey', destination: '/areas/romsey', permanent: true },
      { source: '/new-boiler-ampfield', destination: '/areas/romsey', permanent: true },
      { source: '/new-boiler-north-baddesley', destination: '/areas/romsey', permanent: true },

      {
        source: '/new-boiler-bishops-waltham',
        destination: '/areas/bishops-waltham',
        permanent: true,
      },
      {
        source: '/boiler-service-bishops-waltham',
        destination: '/areas/bishops-waltham',
        permanent: true,
      },
      {
        source: '/emergency-plumber-bishops-waltham',
        destination: '/areas/bishops-waltham',
        permanent: true,
      },
      { source: '/new-boiler-upham', destination: '/areas/bishops-waltham', permanent: true },
      { source: '/new-boiler-durley', destination: '/areas/bishops-waltham', permanent: true },
      { source: '/boiler-service-durley', destination: '/areas/bishops-waltham', permanent: true },
      {
        source: '/emergency-plumber-durley',
        destination: '/areas/bishops-waltham',
        permanent: true,
      },

      { source: '/new-boiler-botley', destination: '/areas/botley', permanent: true },
    ];
  },
};

// The analyzer injects a webpack config, which conflicts with Turbopack —
// only wrap when analyzing (run with `ANALYZE=true next build --webpack`).
export default process.env.ANALYZE === 'true' ? withBundleAnalyzer(config) : config;
