/**
 * Client half of quote-direct's test-submission mechanism (QD-016, RGW-035).
 *
 * When the funnel page is loaded with `?test=<secret>`, every lead-creating
 * call to quote-direct (`/api/quote`, `/api/book`, `/api/callback`) carries
 * that value as the `X-Test-Submission` header. quote-direct verifies the
 * header against its server-only TEST_SUBMISSION_SECRET and never reads the
 * query param itself, so `?test=anything` gains a visitor nothing; with the
 * real secret the lead is stored as `source = 'test'` and no customer or
 * installer email is sent. That is what lets QA click through the live funnel
 * without a fake lead reaching Richard.
 *
 * Mirrors quote-direct's `src/lib/testClient.ts`; keep the header name in
 * sync with its `TEST_SUBMISSION_HEADER`. The secret sits in the browser URL
 * for that session, so don't share a `?test=` link anywhere it shouldn't go.
 */
const TEST_SUBMISSION_HEADER = 'X-Test-Submission';

/**
 * `{ 'X-Test-Submission': <secret> }` when the current URL has a non-empty
 * `?test=` param, else `{}` — spread into a fetch's headers. Safe on the
 * server (no window → `{}`) and never throws.
 */
export function testSubmissionHeaders(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const value = new URLSearchParams(window.location.search).get('test');
    return value ? { [TEST_SUBMISSION_HEADER]: value } : {};
  } catch {
    return {};
  }
}
