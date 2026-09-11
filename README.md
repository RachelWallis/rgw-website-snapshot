# rgwplumbing.co.uk

A snapshot of the code behind [rgwplumbing.co.uk](https://www.rgwplumbing.co.uk), a conversion site for a two-person heating and plumbing firm in Hampshire. Live since 2019, rebuilt on Next.js. RGW is my husband's business, so this is real production work rather than a client engagement — designed and built end to end by me.

This is a published snapshot, not the deploy repo. Internal docs, ops runbooks and commercial material are excluded — see the end.

## Decisions worth reading

**The quote funnel is fetched first-party, not embedded.** From a design brief this looks like an embeddable widget, and an iframe is the obvious build. It's wrong: an iframe severs ad attribution across origins, which would quietly destroy the thing the funnel exists to do — paid traffic landing somewhere that can convert *and* be measured. `components/QuoteFunnel/` calls Quote Direct's API directly from rgwplumbing.co.uk instead. I only found this wiring up the integration; it isn't visible in a design tool.

**Content is version-controlled and served from a CMS.** Help & Advice articles are authored as typed TypeScript in `content/help-articles/`, then imported into Sanity by a GitHub Action on push, keyed to a deterministic `article-<slug>` ID. Articles get review and history like code; editors still get Studio.

**Pricing sits behind a provider interface.** `PricingProvider` has a live-supplier implementation (Wolseley) and a static-table fallback. The live path is server-side only — trade pricing never reaches the browser.

**The CSP is split at `/studio`.** `next.config.mjs` carries the full reasoning. Short version: nonces were rejected because they force every page to dynamic rendering, which would kill the static generation the town and service pages rely on. The strict policy then broke the embedded Sanity Studio, and two rounds of enumerating Sanity's origins failed — the second turned up an entirely separate domain across three directives. Studio now has its own permissive policy; the public surface stays strict. Both reversals are recorded rather than tidied away.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Mantine 8 · Sanity · Resend · Vercel. Jest and Testing Library; ESLint with `jsx-a11y` enforced. No database — leads live in Quote Direct. Town and service pages are statically generated via `generateStaticParams`; the hero is preloaded with `fetchPriority="high"` for LCP.

## Not in this snapshot

Internal process docs, marketing and SEO planning, agent tooling config, and decision-log entries containing supplier pricing. `DECISIONS.md` is included with two commercial entries redacted — the engineering reasoning is the part worth reading.
