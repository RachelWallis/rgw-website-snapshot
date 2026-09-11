import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { business } from '@/lib/business';
import { isHoneypotFilled, isSuspiciouslyFast, rateLimit, requestIp } from '@/lib/spam-guard';

const CONTACT_INBOX = business.email;
const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS ?? 'RGW Website <onboarding@resend.dev>';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown;
  context?: unknown;
  emergency?: unknown;
  startedAt?: unknown;
};

function sanitise(input: unknown, maxLength: number): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  const ip = requestIp(request);
  if (!rateLimit('contact', ip, 10, 10 * 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests, please try again shortly.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: `Email service is not configured. Please call us on ${business.phoneDisplay}.` },
      { status: 503 }
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot + suspiciously-fast-submit checks both indicate a bot, not a
  // human who mistyped something — respond as if successful so the bot
  // doesn't learn what tripped it, but skip actually sending the email.
  if (isHoneypotFilled(body.website) || isSuspiciouslyFast(body.startedAt)) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitise(body.name, 100);
  const email = sanitise(body.email, 200);
  const phone = sanitise(body.phone, 40);
  const message = sanitise(body.message, 4000);
  const isQuote = sanitise(body.context, 20) === 'quote';
  const isEmergency = body.emergency === true;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: CONTACT_INBOX,
    replyTo: email,
    subject: isEmergency
      ? `🚨 URGENT emergency call-out from ${name}`
      : isQuote
        ? `Quote request from ${name}`
        : `Website enquiry from ${name}`,
    text: [
      isEmergency ? '*** EMERGENCY CALL-OUT — please respond ASAP ***' : null,
      isEmergency ? '' : null,
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Phone:   ${phone || '(not given)'}`,
      '',
      'Message:',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n'),
  });

  if (error) {
    return NextResponse.json(
      {
        error: `Something went wrong sending your message. Please call us on ${business.phoneDisplay}.`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
