import Link from 'next/link';
import { IconStarFilled } from '@tabler/icons-react';
import { business } from '@/lib/business';
import classes from './ReviewsTeaser.module.css';

type Review = {
  author: string;
  rating: number;
  text: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className={classes.stars} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: rating }).map((_, i) => (
        <IconStarFilled key={i} size={16} />
      ))}
    </div>
  );
}

type Props = {
  reviews?: Review[];
  heading?: string;
  subheading?: string;
  showViewAllLink?: boolean;
  showGasSafeLink?: boolean;
};

export function ReviewsTeaser({
  reviews,
  heading = 'What our customers say',
  subheading = 'Reviews from our recent customers —',
  showViewAllLink = true,
  showGasSafeLink = false,
}: Props) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className={classes.section}>
      <div className={classes.wrap}>
        <div className={classes.secHead}>
          <span className={classes.eyebrow}>Testimonial</span>
          <h2 className={classes.heading}>{heading}</h2>
          <p className={classes.subheading}>
            {subheading}
            {showViewAllLink && (
              <>
                {' '}
                <Link href="/leave-a-review" className={classes.inlineReviewsLink}>
                  see all reviews
                </Link>
              </>
            )}
          </p>
        </div>

        <div className={classes.reviews}>
          {reviews.map((r, i) => (
            <div key={i} className={classes.review}>
              <Stars rating={r.rating} />
              <p className={classes.reviewText}>&ldquo;{r.text}&rdquo;</p>
              <div className={classes.who}>{r.author}</div>
            </div>
          ))}
        </div>

        {showViewAllLink && (
          <Link href="/leave-a-review" className={classes.reviewsLink}>
            Read all reviews / leave your own →
          </Link>
        )}

        {showGasSafeLink && (
          <a
            href={business.gasSafeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.gasSafeLink}
          >
            Gas Safe registered: {business.gasSafeNumber} — check the register →
          </a>
        )}
      </div>
    </section>
  );
}
