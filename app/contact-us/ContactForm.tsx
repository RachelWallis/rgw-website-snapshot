'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Checkbox, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { business } from '@/lib/business';
import { ENQUIRY_PARAM, enquiryPrefill } from '@/lib/enquiries';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; emergency: boolean }
  | { kind: 'error'; message: string };

type ContactFormProps = {
  context?: 'contact' | 'quote';
  /** Write "How can we help?" for the visitor when they arrived from an
      enquiry link such as "Request a boiler service" (RGW-057). */
  prefillFromEnquiry?: boolean;
};

export function ContactForm({
  context = 'contact',
  prefillFromEnquiry = false,
}: ContactFormProps = {}) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const isQuote = context === 'quote';

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      website: '',
      emergency: false,
      // Captured once, on mount — lets the server flag submissions completed
      // suspiciously fast (a common bot tell), see lib/spam-guard.ts.
      startedAt: Date.now(),
    },
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Please enter your name' : null),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email'),
      message: (v) => (v.trim().length < 10 ? 'A little more detail helps us quote' : null),
    },
  });

  // Write the message for visitors arriving from an enquiry link, once, after
  // mount. Read from window rather than useSearchParams so /contact-us stays
  // prerendered: the hook forces the whole subtree to be client-rendered
  // behind a Suspense boundary, which leaves the empty fallback on screen. The
  // slug is resolved through the allow-list in lib/enquiries.ts, so nothing a
  // link carries can reach the lead email as the customer's words. (RGW-057)
  //
  // `form` is deliberately not a dependency: Mantine returns a new object on
  // every render, so depending on it would re-run this after its own setState
  // and loop. The ref makes running once explicit rather than incidental.
  const enquiryPrefilled = useRef(false);
  useEffect(() => {
    if (!prefillFromEnquiry || enquiryPrefilled.current) {
      return;
    }
    const prefill = enquiryPrefill(new URLSearchParams(window.location.search).get(ENQUIRY_PARAM));
    if (!prefill) {
      return;
    }
    enquiryPrefilled.current = true;
    form.setFieldValue('message', prefill);
  }, [prefillFromEnquiry]);

  const onSubmit = form.onSubmit(async (values) => {
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, context }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: 'error', message: data.error ?? 'Could not send your message.' });
        return;
      }
      setStatus({ kind: 'sent', emergency: values.emergency });
      form.reset();
    } catch {
      setStatus({
        kind: 'error',
        message: `Network problem, please try again or call ${business.phoneDisplay}.`,
      });
    }
  });

  if (status.kind === 'sent') {
    return (
      <Alert
        color={status.emergency ? 'red' : 'green'}
        title={
          status.emergency
            ? 'Emergency flagged as urgent'
            : isQuote
              ? 'Quote request received'
              : 'Message sent'
        }
      >
        {status.emergency
          ? `We’ve flagged this as urgent. For the fastest response, please also call us on ${business.phoneDisplay} now.`
          : isQuote
            ? `Thanks, we’ll come back with a quote within one working day. For urgent jobs, call ${business.phoneDisplay}.`
            : `Thanks, Richard will be in touch shortly. For urgent jobs, call ${business.phoneDisplay}.`}
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="md">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          {...form.getInputProps('website')}
          style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
        />

        <TextInput
          label="Your name"
          placeholder="Jane Smith"
          required
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Phone (optional)"
          type="tel"
          placeholder="07…"
          {...form.getInputProps('phone')}
        />
        <Textarea
          label="How can we help?"
          placeholder="E.g. new boiler for a 3-bed semi, or a leak in the kitchen."
          minRows={5}
          required
          {...form.getInputProps('message')}
        />

        <Checkbox
          label="This is an emergency (no heating or hot water, a leak you can't stop, etc.)"
          description={`We'll flag it as urgent. For a genuine emergency, calling ${business.phoneDisplay} is fastest.`}
          {...form.getInputProps('emergency', { type: 'checkbox' })}
        />

        {status.kind === 'error' && (
          <Alert color="red" title="Could not send">
            {status.message}
          </Alert>
        )}

        <Button type="submit" size="md" color="rgwOrange" loading={status.kind === 'sending'}>
          Send message
        </Button>
      </Stack>
    </form>
  );
}
