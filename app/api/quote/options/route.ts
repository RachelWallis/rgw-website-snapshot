import { NextResponse } from 'next/server';
import { rgwServerPricing } from '@/lib/quote/server-pricing';
import { rateLimit, requestIp } from '@/lib/spam-guard';
import type { QuoteAnswers } from '@/quote-engine';

export async function POST(request: Request) {
  // No lead data here, but pricing lookups can hit the live Wolseley API
  // (server-only, see lib/quote/server-pricing.ts) — worth capping so a
  // bot hammering this endpoint can't burn through supplier API quota.
  const ip = requestIp(request);
  if (!rateLimit('quote-options', ip, 30, 10 * 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests, please try again shortly.' },
      { status: 429 }
    );
  }

  let body: { answers?: QuoteAnswers };
  try {
    body = (await request.json()) as { answers?: QuoteAnswers };
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const answers = body.answers;
  if (!answers || typeof answers !== 'object' || typeof answers.fuelType !== 'string') {
    return NextResponse.json({ error: 'Answers are required.' }, { status: 400 });
  }

  const options = await rgwServerPricing.getQuotes(answers);
  return NextResponse.json({ options });
}
