/**
 * Shared, lightweight spam/bot defences for the lead-capture API routes
 * (`/api/quote`, `/api/quote/options`, `/api/contact`). No third-party
 * service, no CAPTCHA, no account/API key — just the well-known cheap
 * server-side checks: per-IP rate limiting, a honeypot field, and a
 * suspiciously-fast-submit check.
 *
 * The rate limiter is in-memory per server instance (resets on cold start,
 * doesn't share state across regions/instances). That's a known limitation,
 * fine for this site's traffic volume; a durable store (e.g. Upstash) would
 * be the upgrade if it's ever outgrown.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Fixed-window per-key rate limit. Returns true when the request is allowed.
 * `bucketName` namespaces the limiter per endpoint (e.g. 'quote', 'contact')
 * so different routes don't share the same counter.
 */
export function rateLimit(bucketName: string, ip: string, max: number, windowMs: number): boolean {
  const key = `${bucketName}:${ip}`;
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  // Cheap unbounded-growth guard: if the map somehow balloons (e.g. a
  // distributed-IP flood), drop everything rather than leak memory.
  if (buckets.size > 5_000) {
    buckets.clear();
  }
  return ++b.count <= max;
}

/** Best-effort client IP from Vercel/standard forwarding headers. */
export function requestIp(request: Request): string {
  return (
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for') ??
    'unknown'
  )
    .split(',')[0]
    .trim();
}

/**
 * Honeypot check: a form field real users never see or fill in (hidden via
 * CSS, `aria-hidden`, `tabIndex={-1}`), but that bots which blindly fill
 * every input often populate. Any non-empty value means "not human".
 */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0;
}

/** Minimum time (ms) a real person plausibly needs to read and fill a short
 *  lead form. Bots that fetch the page and submit near-instantly are a
 *  common, cheap-to-catch tell. */
export const MIN_HUMAN_SUBMIT_MS = 2500;

/**
 * True when the client reports a form-rendered timestamp and the elapsed
 * time before submit is suspiciously short. `startedAt` is client-supplied
 * (trivially spoofable by a determined attacker) so this is one signal among
 * several, not a security boundary — missing/invalid values fail OPEN
 * (never block a genuine submission just because the signal isn't present,
 * e.g. older client code that hasn't sent it yet).
 */
export function isSuspiciouslyFast(startedAt: unknown, minMs = MIN_HUMAN_SUBMIT_MS): boolean {
  if (typeof startedAt !== 'number' || !Number.isFinite(startedAt)) {
    return false;
  }
  const elapsed = Date.now() - startedAt;
  return elapsed >= 0 && elapsed < minMs;
}
