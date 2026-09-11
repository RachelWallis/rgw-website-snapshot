/**
 * Boiler size band for the /collection/boiler-kw-calculator page
 * (RGW-054, rewired by QD-056).
 *
 * The band comes from quote-direct's `GET /api/size` (QD-056): the same
 * `propertyFit` → fitting rows → tier selection the quote funnel runs, against
 * the tenant's LIVE catalogue, with no lead created. `resolveSizeBand` calls
 * it with the property answers and maps the reply onto `SizeBand`.
 *
 * FALLBACK ONLY: `FALLBACK_COMBI_CATALOGUE` and `fallbackSizeBand` below are
 * the RGW-054 mirror of the catalogue's combi rows, kept so the page still
 * answers when the endpoint is unreachable (network, outage, env var unset).
 * They are NOT a second sizing formula and NOT the source of truth: the copy
 * drifts whenever the catalogue changes (QD-046 changed a rating the same day
 * RGW-054 shipped, which is why QD-056 exists). When the fallback is used the
 * result carries `source: 'fallback'` and the page says so.
 *
 * What stays local on purpose: the option labels (they prefill the funnel's
 * tiles), the combi-or-system guidance copy (RGW's words, not catalogue
 * data) and the GA4 band parameter.
 */

export type Tier = 'value' | 'mid' | 'premium';

export interface CombiRow {
  tier: Tier;
  model: string;
  kw: number;
  maxBedrooms: number;
  highDemandOk: boolean;
  fallbackPrice: number;
  warrantyYears: number;
}

/**
 * FALLBACK ONLY (see the file comment). A snapshot of the combi rows in
 * quote-direct's RGW fixture (`scripts/fixtures/rgw.json`) as of RGW-054.
 * Used by `fallbackSizeBand` when `/api/size` cannot be reached; never
 * consulted while the endpoint answers.
 */
export const FALLBACK_COMBI_CATALOGUE: CombiRow[] = [
  {
    tier: 'value',
    model: 'Greenstar 2000',
    kw: 24,
    maxBedrooms: 2,
    highDemandOk: false,
    fallbackPrice: 770,
    warrantyYears: 5,
  },
  {
    tier: 'value',
    model: 'Greenstar 2000',
    kw: 30,
    maxBedrooms: 3,
    highDemandOk: true,
    fallbackPrice: 880,
    warrantyYears: 5,
  },
  {
    tier: 'mid',
    model: 'Greenstar 4000',
    kw: 25,
    maxBedrooms: 2,
    highDemandOk: false,
    fallbackPrice: 1132,
    warrantyYears: 10,
  },
  {
    tier: 'mid',
    model: 'Greenstar Compact 28CDi',
    kw: 28,
    maxBedrooms: 2,
    highDemandOk: false,
    fallbackPrice: 1090,
    warrantyYears: 5,
  },
  {
    tier: 'mid',
    model: 'Greenstar 4000',
    kw: 30,
    maxBedrooms: 4,
    highDemandOk: true,
    fallbackPrice: 1206,
    warrantyYears: 10,
  },
  {
    tier: 'mid',
    model: 'Greenstar Compact 32CDi',
    kw: 32,
    maxBedrooms: 4,
    highDemandOk: true,
    fallbackPrice: 1230,
    warrantyYears: 5,
  },
  {
    tier: 'mid',
    model: 'Greenstar Compact 36CDi',
    kw: 36,
    maxBedrooms: 4,
    highDemandOk: true,
    fallbackPrice: 1420,
    warrantyYears: 5,
  },
  {
    tier: 'premium',
    model: 'Greenstar 8000+',
    kw: 32,
    maxBedrooms: 4,
    highDemandOk: true,
    fallbackPrice: 1453,
    warrantyYears: 10,
  },
  {
    tier: 'premium',
    model: 'Greenstar 8000+',
    kw: 36,
    maxBedrooms: 5,
    highDemandOk: true,
    fallbackPrice: 1612,
    warrantyYears: 10,
  },
];

/** The funnel's own option labels, so a prefilled answer matches a tile. */
export const BEDROOM_OPTIONS = [
  { value: 1, label: '1 bedroom' },
  { value: 2, label: '2 bedrooms' },
  { value: 3, label: '3 bedrooms' },
  { value: 4, label: '4 bedrooms' },
  { value: 5, label: '5+ bedrooms' },
] as const;

export const BATH_OPTIONS = [
  { value: 0, label: '0 baths' },
  { value: 1, label: '1 bath' },
  { value: 2, label: '2 baths' },
  { value: 3, label: '3+ baths' },
] as const;

export const SHOWER_OPTIONS = [
  { value: 0, label: '0 showers' },
  { value: 1, label: '1 shower' },
  { value: 2, label: '2 showers' },
  { value: 3, label: '3+ showers' },
] as const;

export const PROPERTY_OPTIONS = [
  'Flat or Apartment',
  'Terraced House',
  'Semi-Detached',
  'Detached House',
  'Bungalow',
] as const;

export const CURRENT_BOILER_OPTIONS = [
  'Combi Boiler',
  'System Boiler',
  'Standard Boiler',
  "I'm not sure",
] as const;

export type PropertyType = (typeof PROPERTY_OPTIONS)[number];
export type CurrentBoiler = (typeof CURRENT_BOILER_OPTIONS)[number];

export interface SizeInput {
  /** 1 to 5, where 5 means "5 or more" (the funnel's top option). */
  bedrooms: number;
  baths: number;
  showers: number;
  propertyType: PropertyType;
  currentBoiler: CurrentBoiler;
}

export interface TierPick {
  tier: Tier;
  model: string;
  kw: number;
}

/** Where a `SizeBand` came from: the live endpoint, or the local snapshot. */
export type SizeSource = 'endpoint' | 'fallback';

export interface SizeBand {
  source: SizeSource;
  bedrooms: number;
  highDemand: boolean;
  /** The engine's own `sizeBand` string, e.g. "3 bed, high hot-water demand". */
  label: string;
  /** Combi boilers the engine would offer, value to premium. */
  picks: TierPick[];
  minKw: number;
  maxKw: number;
  /** "30 to 32 kW", or "36 kW" when the range collapses. */
  kwText: string;
  /** Whether a system boiler with a cylinder is worth a serious look. */
  suggestSystem: boolean;
  guidance: string;
}

/** Mirrors `propertyFit` in quote-direct's fit.ts. */
export function isHighDemand(baths: number, showers: number): boolean {
  return baths >= 2 || showers >= 2 || (baths >= 1 && showers >= 1);
}

const TIER_RANK: Record<Tier, number> = { value: 0, mid: 1, premium: 2 };

/** Fallback only: mirrors `fittingBoilers`, `selectTiers` and `dropDominated` in fit.ts. */
export function combiPicks(bedrooms: number, highDemand: boolean, rows = FALLBACK_COMBI_CATALOGUE) {
  const fitting = rows.filter((r) => r.maxBedrooms >= bedrooms && (!highDemand || r.highDemandOk));
  const picks: CombiRow[] = [];
  for (const tier of ['value', 'mid', 'premium'] as Tier[]) {
    const inTier = fitting.filter((r) => r.tier === tier);
    if (!inTier.length) {
      continue;
    }
    picks.push(inTier.reduce((a, b) => (b.fallbackPrice < a.fallbackPrice ? b : a)));
  }
  return picks.filter(
    (x) =>
      !picks.some(
        (y) =>
          y !== x &&
          y.fallbackPrice < x.fallbackPrice &&
          (TIER_RANK[y.tier] > TIER_RANK[x.tier] || y.warrantyYears > x.warrantyYears)
      )
  );
}

function guidanceFor(input: SizeInput, highDemand: boolean, maxKw: number): string {
  const hasCylinder =
    input.currentBoiler === 'System Boiler' || input.currentBoiler === 'Standard Boiler';
  if (hasCylinder) {
    return 'You already have a hot water cylinder, so keeping a system boiler is usually the simplest swap. Changing to a combi means removing the cylinder and altering pipework, which the quote prices as a separate line. The survey settles which is right for your home.';
  }
  if (input.bedrooms >= 5) {
    return `A ${maxKw} kW combi is the top of our combi range and will serve a home this size, but if two showers often run at once a system boiler with an unvented cylinder is usually the better answer. The survey confirms which.`;
  }
  if (input.bedrooms >= 4 && highDemand) {
    return 'A combi in this band will cope, but with this much hot water demand a system boiler with an unvented cylinder is worth a serious look, especially if two showers run at the same time. The survey confirms which.';
  }
  return 'A combi is the right answer for most homes like yours: no tank in the loft, no cylinder, and hot water heated as you use it. The survey confirms the size and checks your radiators and mains water flow.';
}

function hasCylinder(input: SizeInput): boolean {
  return input.currentBoiler === 'System Boiler' || input.currentBoiler === 'Standard Boiler';
}

/** The parts of a `SizeBand` that are RGW's own, whichever source gave the numbers. */
function finishBand(
  input: SizeInput,
  source: SizeSource,
  bedrooms: number,
  highDemand: boolean,
  label: string,
  picks: TierPick[]
): SizeBand {
  const kws = picks.map((p) => p.kw);
  const minKw = Math.min(...kws);
  const maxKw = Math.max(...kws);
  return {
    source,
    bedrooms,
    highDemand,
    label,
    picks,
    minKw,
    maxKw,
    kwText: minKw === maxKw ? `${minKw} kW` : `${minKw} to ${maxKw} kW`,
    suggestSystem: hasCylinder(input) || bedrooms >= 5 || (bedrooms >= 4 && highDemand),
    guidance: guidanceFor(input, highDemand, maxKw),
  };
}

/**
 * FALLBACK ONLY: the band from the local snapshot. Same rules as the engine,
 * but the rows can be stale. `resolveSizeBand` is what the page calls.
 */
export function fallbackSizeBand(input: SizeInput): SizeBand {
  const bedrooms = Math.min(5, Math.max(1, Math.round(input.bedrooms)));
  const highDemand = isHighDemand(input.baths, input.showers);
  const picks = combiPicks(bedrooms, highDemand).map(({ tier, model, kw }) => ({
    tier,
    model,
    kw,
  }));
  return finishBand(
    input,
    'fallback',
    bedrooms,
    highDemand,
    `${bedrooms} bed${highDemand ? ', high hot-water demand' : ''}`,
    picks
  );
}

/* ------------------------------------------------------------------ */
/* Live sizing: quote-direct GET /api/size (QD-056)                    */
/* ------------------------------------------------------------------ */

/**
 * Same env var and tenant/product as QuoteFunnel.tsx, so the calculator sizes
 * against the funnel it hands the customer to. Dev: http://localhost:3001.
 * Read per call (Next inlines the literal `process.env.NEXT_PUBLIC_*` access
 * wherever it sits), so tests can set it before the first request.
 */
export function sizeApiBase(): string {
  return process.env.NEXT_PUBLIC_QUICK_QUOTE_API_URL ?? '';
}
export const SIZE_TENANT = 'rgw';
export const SIZE_PRODUCT = 'default';
/** How long to wait for the endpoint before the fallback answers instead. */
export const SIZE_TIMEOUT_MS = 4000;

/** The fields of quote-direct's `SizeResult` this page reads. */
export interface SizeApiResult {
  sizeBand: string;
  bedrooms: number;
  highDemand: boolean;
  kwMin: number | null;
  kwMax: number | null;
  type: string;
  options: { tier: Tier; make: string; model: string; kw: number; warrantyYears: number }[];
  guidance: string;
}

/**
 * The property answers, keyed by the funnel's own field names, so the
 * endpoint runs the same `propertyFit` on them a quote would. The current
 * boiler type is deliberately NOT sent: this page shows the COMBI band (the
 * engine's default target when no current type is given) and makes its own
 * combi-or-system suggestion in `guidanceFor`; sending "System Boiler" would
 * size a like-for-like system swap instead.
 */
export function sizeQuery(input: SizeInput): string {
  const params = new URLSearchParams({
    tenant: SIZE_TENANT,
    product: SIZE_PRODUCT,
    bedrooms: String(Math.min(5, Math.max(1, Math.round(input.bedrooms)))),
    baths: String(Math.max(0, Math.round(input.baths))),
    showers: String(Math.max(0, Math.round(input.showers))),
    propertyType: input.propertyType,
  });
  return params.toString();
}

export interface ResolveOptions {
  /** quote-direct origin; defaults to NEXT_PUBLIC_QUICK_QUOTE_API_URL. Empty → fallback, no request. */
  apiBase?: string;
  /** Injectable for tests; defaults to the global fetch. */
  fetchImpl?: typeof fetch;
  /** Caller's abort signal (e.g. a superseded render); the timeout is added on top. */
  signal?: AbortSignal;
  timeoutMs?: number;
}

function timeoutSignal(ms: number, outer?: AbortSignal): AbortSignal | undefined {
  const timeout = typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(ms) : undefined;
  if (timeout && outer && typeof AbortSignal.any === 'function') {
    return AbortSignal.any([timeout, outer]);
  }
  return timeout ?? outer;
}

/**
 * The band from the live endpoint. Rejects on any failure (no base URL, network,
 * timeout, non-2xx, malformed body, or a reply with no options, which for RGW's
 * catalogue means it is mid-edit) so `resolveSizeBand` can fall back.
 */
export async function fetchSizeBand(
  input: SizeInput,
  opts: ResolveOptions = {}
): Promise<SizeBand> {
  const apiBase = opts.apiBase ?? sizeApiBase();
  if (!apiBase) {
    throw new Error('NEXT_PUBLIC_QUICK_QUOTE_API_URL is not set');
  }
  const fetchImpl = opts.fetchImpl ?? globalThis.fetch;
  const res = await fetchImpl(`${apiBase}/api/size?${sizeQuery(input)}`, {
    signal: timeoutSignal(opts.timeoutMs ?? SIZE_TIMEOUT_MS, opts.signal),
  });
  if (!res.ok) {
    throw new Error(`/api/size responded ${res.status}`);
  }
  const data = (await res.json()) as Partial<SizeApiResult>;
  const options = Array.isArray(data.options) ? data.options : [];
  if (
    typeof data.sizeBand !== 'string' ||
    typeof data.bedrooms !== 'number' ||
    typeof data.highDemand !== 'boolean' ||
    !options.length ||
    options.some((o) => typeof o.kw !== 'number' || !o.model || !o.tier)
  ) {
    throw new Error('/api/size reply has no usable options');
  }
  return finishBand(
    input,
    'endpoint',
    data.bedrooms,
    data.highDemand,
    data.sizeBand,
    options.map(({ tier, model, kw }) => ({ tier, model, kw }))
  );
}

/**
 * What the page calls: the live band, or the fallback with `source: 'fallback'`
 * when the endpoint cannot answer. Never throws (an aborted request still
 * resolves, to the fallback; the caller that aborted ignores the result).
 */
export async function resolveSizeBand(
  input: SizeInput,
  opts: ResolveOptions = {}
): Promise<SizeBand> {
  try {
    return await fetchSizeBand(input, opts);
  } catch {
    return fallbackSizeBand(input);
  }
}

/** The GA4 `band` parameter: "30-32kW" / "36kW". */
export function bandParam(band: SizeBand): string {
  return band.minKw === band.maxKw ? `${band.minKw}kW` : `${band.minKw}-${band.maxKw}kW`;
}

/**
 * Query string that pre-fills the quote funnel (see QuoteFunnel's
 * `readPrefill`). Values are the funnel's option labels, so the matching
 * tile is highlighted and the engine parses the same numbers it always has.
 */
export function quotePrefillQuery(input: SizeInput): string {
  const params = new URLSearchParams();
  const label = (opts: readonly { value: number; label: string }[], v: number) =>
    opts.find((o) => o.value === Math.min(v, opts[opts.length - 1].value))?.label;
  const bedrooms = label(BEDROOM_OPTIONS, input.bedrooms);
  const baths = label(BATH_OPTIONS, input.baths);
  const showers = label(SHOWER_OPTIONS, input.showers);
  if (bedrooms) {
    params.set('bedrooms', bedrooms);
  }
  if (baths) {
    params.set('baths', baths);
  }
  if (showers) {
    params.set('showers', showers);
  }
  params.set('propertyType', input.propertyType);
  params.set('knowBoilerType', input.currentBoiler);
  return params.toString();
}
