'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  CONSENT_CHANGE_EVENT,
  getStoredConsent,
  isAnalyticsConfigured,
  loadGoogleAnalytics,
  track,
  type ConsentValue,
} from '@/lib/analytics';

/**
 * Site-wide measurement wiring (see docs/measurement-plan.md):
 *  - loads gtag.js once analytics consent is granted (basic consent mode)
 *  - manual page_view on every route change
 *  - phone_tap / whatsapp_tap via delegated listeners on tel: and wa.me
 *    links (covers header, footer, CTAs and the quote wizard without
 *    touching any of them)
 *  - contact_form_sent / lead_email_sent via a fetch bridge that observes
 *    successful POSTs to /api/contact. (The live funnel posts cross-origin to
 *    quote-direct and calls track() itself; the legacy same-origin /api/quote
 *    relay was removed in RGW-062.)
 *
 * Renders nothing. Mounted once in app/layout.tsx; every hook no-ops when
 * NEXT_PUBLIC_GA4_MEASUREMENT_ID is unset.
 */
export function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  // Track consent: initial read after mount + updates from the banner.
  useEffect(() => {
    if (!isAnalyticsConfigured()) {
      return undefined;
    }
    setConsent(getStoredConsent());
    const onChange = (event: Event) => {
      const value = (event as CustomEvent).detail;
      setConsent(value === 'granted' ? 'granted' : 'denied');
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  // Load GA once consent is granted (now or from a previous visit).
  useEffect(() => {
    if (consent === 'granted') {
      loadGoogleAnalytics();
    }
  }, [consent]);

  // Manual page views (config uses send_page_view: false).
  useEffect(() => {
    if (consent !== 'granted' || !pathname) {
      return;
    }
    track('page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [consent, pathname]);

  // Delegated phone_tap listener + fetch bridge for lead conversions.
  useEffect(() => {
    if (!isAnalyticsConfigured()) {
      return undefined;
    }
    patchFetchForConversions();
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const telLink = target?.closest?.('a[href^="tel:"]');
      if (telLink) {
        track('phone_tap', {
          link_text: (telLink.textContent ?? '').trim().slice(0, 60),
          page_path: window.location.pathname,
        });
        return;
      }
      const waLink = target?.closest?.('a[href^="https://wa.me/"]');
      if (waLink) {
        track('whatsapp_tap', {
          link_text: (waLink.textContent ?? '').trim().slice(0, 60),
          page_path: window.location.pathname,
        });
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* Fetch bridge                                                         */
/* ------------------------------------------------------------------ */

let fetchPatched = false;

function patchFetchForConversions(): void {
  if (fetchPatched || typeof window === 'undefined') {
    return;
  }
  fetchPatched = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);
    try {
      reportLeadConversions(input, init, response);
    } catch {
      // Measurement must never break the request path.
    }
    return response;
  };
}

function reportLeadConversions(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  response: Response
): void {
  if (!response.ok) {
    return;
  }
  const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(rawUrl, window.location.origin);
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
  // Exact pathname match: /api/quote/options (pricing) is also a same-origin
  // POST and must never count as a lead.
  if (method !== 'POST' || url.origin !== window.location.origin) {
    return;
  }
  if (url.pathname === '/api/contact') {
    const body = parseJsonBody(init?.body);
    if (isHoneypotSubmission(body)) {
      return;
    }
    const context = typeof body?.context === 'string' ? body.context : 'contact';
    track('contact_form_sent', { form_context: context });
    track('lead_email_sent', {
      lead_type: context === 'quote' ? 'quote_form' : 'contact_form',
    });
  }
}

function parseJsonBody(body: BodyInit | null | undefined): Record<string, unknown> | null {
  if (typeof body !== 'string') {
    return null;
  }
  try {
    const parsed = JSON.parse(body);
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Bots that fill the hidden website field get a 2xx but are not leads. */
function isHoneypotSubmission(body: Record<string, unknown> | null): boolean {
  return typeof body?.website === 'string' && body.website.length > 0;
}
