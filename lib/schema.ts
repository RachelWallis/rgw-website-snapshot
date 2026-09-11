import { business } from './business';
import { serviceAreas } from './service-areas';

export type AggregateRatingInput = {
  averageRating: number | null;
  totalRatings: number | null;
};

/**
 * Google only renders a star rating in results when the markup carries a real
 * rating and review count, and it must match what a visitor can see on the
 * page. Both come from the live Places API, so when that call fails or is
 * unconfigured we omit the property entirely rather than invent one.
 */
export function localBusinessSchema(rating?: AggregateRatingInput) {
  const aggregateRating =
    rating?.averageRating && rating.totalRatings
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.averageRating,
            reviewCount: rating.totalRatings,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {};

  return {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    '@id': `${business.url}/#business`,
    name: business.name,
    url: business.url,
    telephone: business.phoneE164,
    email: business.email,
    image: `${business.url}/images/richKai.webp`,
    logo: `${business.url}/images/logo/logo.svg`,
    priceRange: '££',
    // Full street address, not just the locality: Google weights a complete,
    // consistent NAP heavily for local ranking, and it must match the Google
    // Business Profile exactly.
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postcode,
      addressCountry: business.address.country,
    },
    // Bishopstoke. Helps Google tie the business to the home patch for
    // "near me" queries, which the postal address alone does not do.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.9739,
      longitude: -1.3336,
    },
    ...aggregateRating,
    founder: { '@type': 'Person', name: business.founderName },
    foundingDate: business.foundingYear.toString(),
    areaServed: serviceAreas.map((a) => ({ '@type': 'City', name: a.name })),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certification',
      name: 'Gas Safe Register',
      identifier: business.gasSafeNumber,
      url: business.gasSafeUrl,
    },
    openingHoursSpecification: business.openingHoursSpec.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
  };
}

export type Faq = { question: string; answer: string };

export function faqPageSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/**
 * Ties a landing/service page to a named service and back to the business
 * node, so Google reads the page as "this business offers this service in
 * this town" rather than as a standalone page that happens to name a town.
 */
export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  areaName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    serviceType: opts.name,
    provider: { '@id': `${business.url}/#business` },
    ...(opts.areaName ? { areaServed: { '@type': 'City', name: opts.areaName } } : {}),
  };
}

/** Breadcrumbs give Google the site hierarchy and earn a breadcrumb trail in results. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${business.url}${crumb.path}`,
    })),
  };
}

/** Article + author/publisher markup for Help & Advice pieces — eligible for article rich results. */
export function articleSchema(a: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    ...(a.description ? { description: a.description } : {}),
    ...(a.image ? { image: a.image } : {}),
    ...(a.datePublished ? { datePublished: a.datePublished } : {}),
    dateModified: a.dateModified ?? a.datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
    author: { '@type': 'Organization', name: business.name, url: business.url },
    publisher: {
      '@type': 'Organization',
      name: business.name,
      logo: { '@type': 'ImageObject', url: `${business.url}/images/logo/logo.svg` },
    },
  };
}

/**
 * JSON-LD is dropped into a <script> verbatim, and the HTML parser ends a
 * script element at the first `</script` it sees, however it got there. Some
 * of the values come from Sanity (article titles, excerpts), so a title such
 * as `</script><script>...` would otherwise run on the page. Escaping `<`,
 * `>` and `&` as JSON \u escapes keeps the payload valid JSON and inert as
 * markup; consumers parse it as JSON, never as HTML. (RGW-061)
 */
export function serializeJsonLd(schema: object): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function jsonLdScriptProps(schema: object) {
  return {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: serializeJsonLd(schema) },
  } as const;
}
