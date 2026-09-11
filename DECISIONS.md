# RGW Heating & Plumbing — decisions

Some entries reference files not included in this public snapshot.

One line of context each, newest first. Check here before re-deciding
anything already settled. Ported 2026-08-13 from real decisions found in
this repo's gitignored `tasks.md` and the RGW-relevant rows of the shared
cross-repo log at `~/CODE/quote-sites/docs/decisions.md` — that shared file
stays the source of truth for decisions spanning both `rgw-heating-plumbing`
and `quote-direct`; this file is RGW-specific only, going forward.
Business/advisory decisions for RGW-the-company (D1–D6…) live outside this
repo, in the Google Drive `RGW/` decision log — referenced here only when
they gate technical work.

## Active decisions

| # | Date | Decision |
|---|------|----------|
| 16 | 2026-09-09 | **Richard does take emergency call-outs; the rule saying otherwise was wrong. Supersedes #1 on the facts, keeps it on the tone.** Asked directly whether Richard takes out-of-hours call-outs, Rachel said: "he does emergency call outs, the rulebook is wrong" (session with AB, 2026-09-09). The live site had been stating 24-hour cover in 17 places across 7 files throughout — `app/layout.tsx`, `Usps.tsx`, `EmergencyStrip.tsx`, `TrustStrip.tsx`, `lib/business.ts`, `lib/services.ts`, `content/town-pages.ts` — and those statements are correct and stay. What #1 actually recorded was a rejection of an unrequested banner and of shouty urgency copy; somewhere that hardened into "RGW does not do emergency work", which is a different and false claim. It then shaped real work: cards were written to avoid the word, and `lib/__tests__/enquiries.test.ts` enforced its absence, so a true statement would have failed CI. **What changes:** emergency cover may be stated plainly as a fact. **What does not:** no urgency shouting, no countdowns, no "call now" pressure, and no feature whose purpose is to increase Richard's hours — the reasoning in #1 about his family time is untouched and still governs. The lesson worth keeping: a constraint nobody re-checked against the business outranked the business for weeks. |
| 15 | 2026-09-08 | commercial decision — redacted for the public snapshot. |
| 1 | 2026-08-12 | *(Superseded in part by #16 — the tone judgement stands, the implied claim that RGW does not do emergency work was false.)* **24/7 emergency-callout messaging is explicitly not a business priority.** An agent added an emergency-cover homepage banner as part of a spam-protection task; Rachel rejected and reverted it (`bcf9da2`). The mission-critical goal is revenue growth *without* taking Richard away from his family — a prominent "call us 24/7" callout invites more after-hours demand on his own time. Don't propose or build features that increase Richard's availability/hours (emergency call-outs, on-call features) unless explicitly asked. The existing generic "24-hour emergency cover" trust chip elsewhere on the site predates this and was left as-is, not flagged as a problem. |
| 2 | 2026-08-12 | **`rgw-alpha.vercel.app` alias removed entirely, not tagged/preserved.** Investigation found it wasn't a separate staging build — `vercel inspect` showed it aliased to the exact same production deployment as `rgwplumbing.co.uk`, so it was silently serving live production under a second URL (worse than the original "is this test traffic" framing assumed). Removed via `vercel alias rm`. A dedicated staging environment will be created if/when one's actually needed. Leaves the "test vs. live leads" audit needing a manual eyeball pass on ~200 existing rows, since no request origin was ever captured historically — see `kanban/tickets/RGW-*` (quote-funnel lead audit) for the follow-up work.<br>**2026-08-24 follow-up:** checking Vercel directly, `rgw-alpha.vercel.app` is *still* an active alias on the current production deployment, aliased alongside `rgwplumbing.co.uk`. Either this decision's removal didn't fully take, or a later deploy re-added it — Vercel re-attaches a deployment's prior aliases by default unless a deploy explicitly excludes them. Not removed again pending Rachel's call: it's a live production domain, and pulling it without checking who/what might be depending on it (bookmarks, old ad creative, backlinks) could break something silently. Rachel to decide: remove it again (and if so, figure out why it keeps coming back so this doesn't recur) or accept it's staying and update this decision accordingly. |
| 3 | 2026-07-13 | **RGW integration with quote-direct is first-party/same-origin, no iframe.** Protects Ads attribution and Quality Score. `components/QuoteFunnel/QuoteFunnel.tsx` fetches quote-direct's `/api/questions` and `/api/quote` directly; the old dormant iframe path (`NEXT_PUBLIC_QUICK_QUOTE_ORIGIN`) was removed, not left dormant. Cancelled the earlier iframe-vs-first-party spike (superseded #3 below). |
| 4 | 2026-07-11 | **The funnel opens with service selection and routes by it — no heating-only assumption.** Visitors wanting work RGW doesn't quote online (e.g. general plumbing) never dead-end: the funnel signposts a human path and still captures their contact details as a lead. Lands via quote-direct's branching question engine; RGW's now-frozen `quote-engine/` wizard does not get this feature directly — RGW gets it through the first-party integration (#3 above). |
| 5 | 2026-07-07 | **RGW keeps its first-party wizard until quote-direct earns the swap.** The iframe embed in `InstantQuoteSection` was wired but dormant, gated on UI parity, quote-only mode, RGW tenant branding, and an Ads conversion-tracking answer for cross-origin iframes — resolved by #3 (first-party fetch) rather than ever activating the iframe. |
| 6 | 2026-07-06 | **`quote-engine/`'s wizard UI is the design source of truth**, and is being ported into quote-direct as its funnel frontend — never deleted, feature work frozen (bugfixes only) so RGW and quote-direct stop diverging and paying for every feature twice. |
| 7 | 2026-07-06 | **Path to live is sequenced**: Wolseley API → publish → Richard's look/feel sign-off → content agreed → Sanity publishing → quote engine end-to-end → Richard's commercials sign-off → Ads + conversion tracking. Richard cannot sign off commercials before steps 1–3. Ads spend is additionally gated on advisory decision D6 (repricing). |
| 8 | 2026-07-06 | **Wolseley pricing**: quote-direct's iHub client is canonical; RGW's own `quote-engine/pricing/wolseley.ts` (old Azure-APIM flow) is a dead end, not worth fixing independently. Live pricing arrives via the quote-direct integration once Wolseley's IP allow-list opens. Both paths are blocked externally either way. |
| 9 | 2026-07-06 | **Booking is quote-only for RGW, enforced as platform config** (`brand.bookingEnabled` in quote-direct). Funnel always ends at "we'll call to arrange a free survey" — no dates, no online booking/payment, ever. Matches the original 2026-07-01 design decision, now enforced in code rather than just convention. |
| 10 | 2026-07-01 | **No online booking/payment on RGW** — the human call is the differentiator for a local trusted firm, not a gap to close later. |
| 11 | 2026-07-01 | **RGW is tenant #1 of quote-direct**, the proof case that makes the platform sellable — deliberate short-term overlap between `quote-engine/` and quote-direct accepted as the cost of proving the funnel converts before selling it to anyone else. |
| 12 | 2026-08-25 | **Richard's look-and-feel + content sign-off is approved** (closes `RGW-003`, path-to-live steps 3-4). Rachel had confirmed this directly, repeatedly, before today — none of it reached this file or the ticket until now. **Process fix, not just a decision**: a verbal/chat approval given to any session (Ted or a dispatched bot) must be written to this file in the same turn it's given, not just acted on. Silently proceeding without a durable record is exactly the "decisions made, not tracked" failure `ted-c`'s own `BRAIN-001` was created to catch — it happened here anyway, across whatever session(s) she told. Going forward: any time Rachel gives an approval, sign-off, or explicit decision, it gets logged here (or the relevant repo's own `DECISIONS.md`) immediately, before moving on to the next thing. |

| 13 | 2026-08-24 | **Wolseley pricing is live**, superseding #8. As of commit `2358ca9` (2026-08-21, RGW-002/RGW-004), the prod key/secret rotated and `wolseley-proxy` was verified end-to-end — pricing is no longer blocked on Wolseley's IP allow-list. |
| 14 | 2026-08-28 | commercial decision — redacted for the public snapshot. |

| 13 | 2026-08-28 | **`ContactRail` moved back to the right** (`right: 14px`), reversing RGW-025's confirmed left-side decision from three days earlier. Found during Rachel's own live walkthrough of the get-a-quote funnel on a phone: the rail (then on the left, per RGW-025) was blocking page content on several screens. She asked for the SMS/"Text us" icon removed and the best position re-researched. Right-side chosen: matches thumb-zone/right-handed-majority convention, and no other fixed-position element conflicts there (header nav is sticky-top, `ConsentBanner` is a full-width bottom bar, not a corner element). Rail is now WhatsApp/Call/Email only (3 icons, `.neutral` CSS class removed as dead code). Supersedes #RGW-025 — see "Superseded/updated" below. |

## Superseded

- ~~"Horizon 3 = 'trade-websites', scaffolded 2026-07-06"~~ (retired
  2026-08-11, shared decisions log #12) — Rachel doesn't recognise this as
  an intentional commitment; treated as a speculative note. `readyweb` (a
  separately-built live project) ended up matching much of the shape by
  coincidence, not by executing this plan. Still referenced as a concept
  scaffold in `BRIEF.md`'s scope section and `tasks.md`, not deleted, just
  not an active commitment.
- ~~"RGW embeds quote-direct and `quote-engine/` gets deleted"~~
  (2026-07-01) — superseded by #6 above: the engine's UI is the asset, it
  moves into quote-direct instead.
- ~~"Whole customer journey hosted on quote-direct's domain, no embed v1"~~
  (2026-07-02 brief) — softened, then resolved by #3: first-party fetch,
  not an embed of any kind.

## Superseded/updated

- ~~"`rgw-alpha.vercel.app` alias removed entirely, not tagged/preserved" (#2 above)~~ — updated 2026-08-24: Rachel confirmed she wants to **keep** `rgw-alpha.vercel.app` intentionally now, as a reserved staging alias. It currently mirrors production exactly and isn't used for anything yet, but stays available for real staging use if/when needed rather than being removed again. Not a reversal of the original investigation (it genuinely wasn't a separate build back then) — just a new decision to repurpose it going forward instead of deleting it.
- ~~"ContactRail stays on the left" (`RGW-025`, closed 2026-08-25)~~ — reversed 2026-08-28 (#13 above): Rachel found it blocking content during a live walkthrough and asked for it repositioned; moved back to the right.
