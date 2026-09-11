import type { Metadata } from 'next';
import { ReviewRedirect } from '@/components/ReviewRedirect/ReviewRedirect';
import { getReviewUrl } from '@/lib/review-url';

/**
 * rgwplumbing.co.uk/review — the one short address a card in the van, a
 * text and an email footer can all point at (RGW-042). Counts the visit,
 * then hops to Google's write-a-review page. Not in the sitemap; not for
 * search engines.
 */
export const metadata: Metadata = {
  title: 'Leave a review',
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return <ReviewRedirect target={getReviewUrl()} />;
}
