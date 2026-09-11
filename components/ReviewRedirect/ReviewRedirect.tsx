'use client';

import { useEffect } from 'react';
import { IconBrandGoogle } from '@tabler/icons-react';
import { Button, Container, Loader, Stack, Text, Title } from '@mantine/core';
import { track } from '@/lib/analytics';

/** Delay before leaving, long enough for gtag to queue the event. */
export const REDIRECT_DELAY_MS = 400;

/**
 * /review's interstitial: counts the visit as `review_link_used` (consent
 * permitting — track() drops it otherwise, like every other event) and
 * then sends the visitor on to Google. A plain server redirect could not
 * fire a GA4 event, and the Measurement Protocol would need a new secret
 * (docs/measurement-plan.md), so the page itself does the hop. The button
 * is the fallback for anyone whose browser blocks the automatic redirect.
 */
export function ReviewRedirect({ target }: { target: string }) {
  useEffect(() => {
    let host = '';
    try {
      host = new URL(target).hostname;
    } catch {
      host = '';
    }
    track('review_link_used', { target_host: host });
    const timer = window.setTimeout(() => {
      window.location.replace(target);
    }, REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [target]);

  return (
    <section>
      <Container size="sm" py={{ base: 80, md: 140 }}>
        <Stack gap="md" ta="center" align="center">
          <Loader color="rgwBlue" />
          <Title order={1} size="h2">
            Taking you to Google to leave a review
          </Title>
          <Text c="dimmed">Thank you — it really helps other homeowners find us.</Text>
          <Button
            component="a"
            href={target}
            rel="noopener noreferrer"
            color="rgwOrange"
            leftSection={<IconBrandGoogle size={18} />}
          >
            Open Google reviews
          </Button>
        </Stack>
      </Container>
    </section>
  );
}
