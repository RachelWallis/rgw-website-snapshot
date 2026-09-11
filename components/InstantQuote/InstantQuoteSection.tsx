import { QuoteFunnel } from '@/components/QuoteFunnel/QuoteFunnel';

/**
 * Renders the QQ-powered quote funnel inline (first-party, same-origin page).
 * API calls go to NEXT_PUBLIC_QUICK_QUOTE_API_URL (set per-environment in Vercel).
 * The iframe embed path has been removed, QQ is the canonical funnel for RGW.
 */
export function InstantQuoteSection() {
  return <QuoteFunnel />;
}
