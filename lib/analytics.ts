/**
 * GA4 analytics + consent plumbing. See docs/measurement-plan.md for the
 * event dictionary and the PECR/GDPR rationale.
 *
 * Everything is gated twice:
 *   1. `NEXT_PUBLIC_GA4_MEASUREMENT_ID` unset → total no-op (no banner, no
 *      scripts, `track()` drops everything).
 *   2. No analytics consent → gtag.js is never fetched (basic consent mode)
 *      and `track()` drops events rather than queueing them.
 *
 * This module is import-safe on the server (no top-level window access).
 */

export type ConsentValue = 'granted' | 'denied';

export const CONSENT_STORAGE_KEY = 'rgw-consent';
/** Fired on window whenever the stored consent choice changes. */
export const CONSENT_CHANGE_EVENT = 'rgw:consent-change';
/** Fired on window to re-open the consent banner (footer "Cookie settings"). */
export const CONSENT_OPEN_EVENT = 'rgw:consent-open';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getMeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '';
}

export function isAnalyticsConfigured(): boolean {
  return getMeasurementId().length > 0;
}

/**
 * Inline <head> snippet: gtag stub + Consent Mode v2 defaults, all DENIED.
 * Runs before anything else so no Google tag can ever start ahead of it.
 * Sets no cookies and touches no storage.
 */
export const CONSENT_DEFAULT_SNIPPET = [
  'window.dataLayer = window.dataLayer || [];',
  'window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};',
  "window.gtag('consent', 'default', {",
  "  ad_storage: 'denied',",
  "  ad_user_data: 'denied',",
  "  ad_personalization: 'denied',",
  "  analytics_storage: 'denied'",
  '});',
].join('\n');

function ensureGtagStub(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
}

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as { analytics?: unknown };
    return parsed.analytics === 'granted' || parsed.analytics === 'denied'
      ? parsed.analytics
      : null;
  } catch {
    return null;
  }
}

/**
 * Persist the visitor's choice (only ever called from a user action),
 * notify listeners, and on decline expire any GA cookies left over from an
 * earlier acceptance.
 */
export function storeConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ analytics: value, updatedAt: new Date().toISOString() })
    );
  } catch {
    // Private mode etc., consent still applies for this page view via the event.
  }
  if (value === 'denied') {
    expireGoogleAnalyticsCookies();
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

export function openConsentSettings(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT));
}

function expireGoogleAnalyticsCookies(): void {
  const hostname = window.location.hostname;
  const domains = ['', hostname, `.${hostname}`];
  document.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim() ?? '')
    .filter((name) => name === '_ga' || name.startsWith('_ga_'))
    .forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${
          domain ? `; domain=${domain}` : ''
        }`;
      });
    });
}

/* ------------------------------------------------------------------ */
/* Attribution (in-memory only, no storage, so no PECR consent needed) */
/* ------------------------------------------------------------------ */

const ATTRIBUTION_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

let attribution: Record<string, string> | null = null;

/** First-touch UTM/gclid params for this JS session (module memory only). */
export function getAttribution(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }
  if (attribution === null) {
    attribution = {};
    const params = new URLSearchParams(window.location.search);
    for (const key of ATTRIBUTION_KEYS) {
      const value = params.get(key);
      if (value) {
        attribution[key] = value.slice(0, 200);
      }
    }
  }
  return attribution;
}

/* ------------------------------------------------------------------ */
/* Event + loader API                                                   */
/* ------------------------------------------------------------------ */

/**
 * Send a GA4 event. Drops (never queues) unless a measurement ID is
 * configured AND the visitor has granted analytics consent, pre-consent
 * behaviour must not be retro-reported.
 */
export function track(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || !isAnalyticsConfigured()) {
    return;
  }
  if (getStoredConsent() !== 'granted') {
    return;
  }
  ensureGtagStub();
  window.gtag!('event', eventName, { ...getAttribution(), ...params });
}

export const GA_SCRIPT_ID = 'ga4-gtag-js';

/**
 * Basic consent mode: only called after the visitor grants analytics
 * consent. Pushes the consent update, injects gtag.js, and configures GA4
 * with manual page views. Idempotent.
 */
export function loadGoogleAnalytics(): void {
  if (typeof window === 'undefined' || !isAnalyticsConfigured()) {
    return;
  }
  ensureGtagStub();
  window.gtag!('consent', 'update', { analytics_storage: 'granted' });
  if (document.getElementById(GA_SCRIPT_ID)) {
    return;
  }
  const measurementId = getMeasurementId();
  window.gtag!('js', new Date());
  window.gtag!('config', measurementId, { send_page_view: false });
  const script = document.createElement('script');
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}
