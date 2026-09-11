import type { Metadata } from 'next';
import { AdviceTeaser } from '@/components/AdviceTeaser/AdviceTeaser';
import { AreasTeaser } from '@/components/AreasTeaser/AreasTeaser';
import { EmergencyStrip } from '@/components/EmergencyStrip/EmergencyStrip';
import { Hero } from '@/components/Hero/Hero';
import { HomePricing } from '@/components/HomePricing/HomePricing';
import { HowItWorks } from '@/components/HowItWorks/HowItWorks';
import { ProblemsSolved } from '@/components/ProblemsSolved/ProblemsSolved';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';
import { ReviewsTeaser } from '@/components/ReviewsTeaser/ReviewsTeaser';
import { TrustStrip } from '@/components/TrustStrip/TrustStrip';
import { WhyTwoManFirm } from '@/components/WhyTwoManFirm/WhyTwoManFirm';
import { business } from '@/lib/business';
import { getGoogleReviews } from '@/lib/google-reviews';
import classes from './page.module.css';

// Set explicitly: the root layout's relative `canonical: './'` resolves to
// `/index` on the home route, which is not a real URL. Every other page
// declares its own canonical, so this is the only route that needs the
// override. Title/description also overridden here (RGW-029) — the
// homepage previously inherited the generic site-wide default.
// RGW-056: the home page ranks position 1 for "boiler installation near
// me" and "boiler installation" on zero clicks — the title/description
// weren't earning the click. `title.absolute` bypasses the root layout's
// ` | RGW Heating & Plumbing` template so the rendered SERP title stays
// under 60 characters exactly, rather than the template pushing it past
// the truncation point.
export const metadata: Metadata = {
  title: { absolute: 'Boiler Installation in Eastleigh & Winchester | RGW' },
  description:
    'Gas Safe engineers in Eastleigh and Winchester. See a fitted boiler installation price online in 90 seconds, no salesperson, before you speak to anyone.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
};

export default async function HomePage() {
  const { reviews, averageRating, totalRatings } = await getGoogleReviews(3);
  const yearsTrading = new Date().getFullYear() - business.foundingYear;

  return (
    <div className={classes.page}>
      <Hero averageRating={averageRating} totalRatings={totalRatings} />
      <EmergencyStrip />
      <TrustStrip />
      <HomePricing />
      <ProblemsSolved />
      <HowItWorks />
      <WhyTwoManFirm />
      <ReviewsTeaser
        reviews={reviews}
        heading={`${yearsTrading} years, and still mostly word of mouth`}
        showGasSafeLink
      />
      <AreasTeaser />
      <AdviceTeaser />
      <QuoteCta />
    </div>
  );
}
