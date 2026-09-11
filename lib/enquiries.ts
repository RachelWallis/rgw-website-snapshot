/**
 * Enquiries a visitor can start from a link, which open /contact-us with the
 * "How can we help?" message already written (RGW-057).
 *
 * Deliberately an allow-list keyed by a short slug, never free text in the
 * query string: whatever ends up in that field is emailed to Richard as the
 * customer's own words, so a link like `?message=<anything>` must not be able
 * to put words in their mouth. Keeping the wording here also keeps it in the
 * brand's voice (BRAND.md) — a request, never a booking, and never a promise
 * about when we turn up.
 */
export const enquiryPrefills = {
  'boiler-service': 'I’d like to request an annual boiler service.',
} as const;

export type EnquiryKey = keyof typeof enquiryPrefills;

/** Query-string key carrying the enquiry slug. */
export const ENQUIRY_PARAM = 'enquiry';

/** The /contact-us URL that opens the form prefilled for this enquiry. */
export function enquiryHref(key: EnquiryKey): string {
  return `/contact-us?${ENQUIRY_PARAM}=${key}`;
}

/**
 * Prefill text for a raw query-string value. Anything not on the allow-list
 * (including null, an unknown slug, or injected prose) yields '', so the form
 * simply opens empty.
 */
export function enquiryPrefill(key: string | null | undefined): string {
  if (typeof key !== 'string' || !Object.hasOwn(enquiryPrefills, key)) {
    return '';
  }
  return enquiryPrefills[key as EnquiryKey];
}
