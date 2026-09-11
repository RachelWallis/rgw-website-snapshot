import { business } from './business';

/**
 * Where "leave us a Google review" points. The canonical value is the public
 * short link in lib/business.ts (Rachel, from the Business Profile panel,
 * 2026-09-06); REVIEW_URL is an optional server-side override so the target
 * can change without a code edit. Always returns a URL — /review must never
 * dead-end.
 */
export function getReviewUrl(): string {
  return process.env.REVIEW_URL?.trim() || business.reviewUrl;
}
