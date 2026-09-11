import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { Resend } from 'resend';
import { business } from '@/lib/business';

// Synthetic check for the instant-quote funnel: hits quote-direct's funnel
// API (the same endpoint QuoteFunnel.tsx calls on load) and emails Richard
// if it's down (RGW-014, tracked in Trello). A prior CORS/env-var outage
// broke /get-a-quote silently until manually caught.

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? 'RGW Website <onboarding@resend.dev>';
const FUNNEL_API_BASE = process.env.NEXT_PUBLIC_QUICK_QUOTE_API_URL ?? '';
const TENANT = 'rgw';
const PRODUCT = 'default';
const CHECK_TIMEOUT_MS = 10_000;

type CheckResult = { ok: true } | { ok: false; reason: string };

// Same fail-closed shape as quote-direct's cronAuthorized() (src/lib/session.ts):
// an unset CRON_SECRET in production means "auth required and unconfigured"
// (rejected), not "auth not needed" (open) — the old `if (!secret) return true`
// left this wide open to anyone who found the URL. Dev with no CRON_SECRET set
// stays open so `next dev` + curl keeps working without extra setup.
function isAuthorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== 'production';
  }
  const header = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  const headerBuf = Buffer.from(header);
  const expectedBuf = Buffer.from(expected);
  if (headerBuf.length !== expectedBuf.length) {
    return false;
  }
  return timingSafeEqual(headerBuf, expectedBuf);
}

async function checkFunnelApi(): Promise<CheckResult> {
  if (!FUNNEL_API_BASE) {
    return { ok: false, reason: 'NEXT_PUBLIC_QUICK_QUOTE_API_URL is not configured' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    const res = await fetch(
      `${FUNNEL_API_BASE}/api/questions?tenant=${TENANT}&product=${PRODUCT}`,
      { signal: controller.signal, cache: 'no-store' }
    );
    if (!res.ok) {
      return { ok: false, reason: `Funnel API returned ${res.status} ${res.statusText}` };
    }
    return { ok: true };
  } catch (err) {
    if (controller.signal.aborted) {
      return { ok: false, reason: `Funnel API timed out after ${CHECK_TIMEOUT_MS}ms` };
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { ok: false, reason: `Funnel API request failed: ${message}` };
  } finally {
    clearTimeout(timeout);
  }
}

async function sendAlert(reason: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Can't email without Resend configured; the failed check result (and
    // Vercel's own cron-invocation logs) is the only signal in that case.
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM_ADDRESS,
    to: business.email,
    subject: '🚨 RGW instant quote funnel is down',
    text: [
      "The instant quote funnel's synthetic check just failed.",
      '',
      `Reason: ${reason}`,
      '',
      'This likely means /get-a-quote is broken for visitors right now.',
      `Checked: ${FUNNEL_API_BASE}/api/questions?tenant=${TENANT}&product=${PRODUCT}`,
      `Time: ${new Date().toISOString()}`,
    ].join('\n'),
  });
}

export async function GET(request: Request) {
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await checkFunnelApi();

  if (!result.ok) {
    await sendAlert(result.reason);
    return NextResponse.json({ ok: false, reason: result.reason }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
