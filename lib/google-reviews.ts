export type GoogleReview = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
};

type PlacesApiResponse = {
  rating?: number;
  userRatingCount?: number;
  reviews?: Array<{
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    authorAttribution?: { displayName?: string };
  }>;
};

export type GoogleReviewsResult = {
  reviews: GoogleReview[];
  averageRating: number | null;
  totalRatings: number | null;
};

const EMPTY: GoogleReviewsResult = { reviews: [], averageRating: null, totalRatings: null };

export async function getGoogleReviews(limit = 5): Promise<GoogleReviewsResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) {
    return EMPTY;
  }

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error('Google Places API returned', res.status, await res.text());
      return EMPTY;
    }

    const data = (await res.json()) as PlacesApiResponse;

    const reviews: GoogleReview[] =
      data.reviews
        ?.filter((r) => r.text?.text && r.authorAttribution?.displayName)
        .slice(0, limit)
        .map((r) => ({
          author: r.authorAttribution!.displayName!,
          rating: r.rating ?? 5,
          text: r.text!.text!,
          relativeTime: r.relativePublishTimeDescription ?? '',
        })) ?? [];

    return {
      reviews,
      averageRating: data.rating ?? null,
      totalRatings: data.userRatingCount ?? null,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch Google reviews', err);
    return EMPTY;
  }
}
