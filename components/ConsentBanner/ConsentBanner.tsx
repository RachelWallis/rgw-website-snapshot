'use client';

import { useEffect, useState } from 'react';
import { Button, Group, Paper, Text } from '@mantine/core';
import {
  CONSENT_OPEN_EVENT,
  getStoredConsent,
  isAnalyticsConfigured,
  storeConsent,
} from '@/lib/analytics';
import classes from './ConsentBanner.module.css';

/**
 * UK PECR-compliant first-party consent banner (no third-party CMP).
 *
 * - Only rendered when GA4 is configured, no analytics, no banner.
 * - Nothing is written to the device before the visitor chooses; the choice
 *   itself (localStorage) is the strictly-necessary exemption.
 * - Accept and Decline are equal-weight single clicks; declining is
 *   remembered and the site works identically.
 * - Reopenable via the footer "Cookie settings" link (consent withdrawal).
 * - Non-blocking region (not a modal): keyboard users aren't trapped and
 *   the page stays usable, per WCAG 2.1.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAnalyticsConfigured()) {
      return undefined;
    }
    if (getStoredConsent() === null) {
      setVisible(true);
    }
    const onOpen = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  if (!visible) {
    return null;
  }

  const choose = (value: 'granted' | 'denied') => {
    storeConsent(value);
    setVisible(false);
  };

  return (
    <Paper
      component="section"
      role="region"
      aria-label="Cookies on this site"
      className={classes.banner}
      withBorder
      shadow="lg"
      radius="lg"
      p="md"
    >
      <div className={classes.inner}>
        <div>
          <Text fw={700} size="sm">
            Cookies on this site
          </Text>
          <Text size="sm" c="dimmed">
            We&rsquo;d like to use Google Analytics cookies to understand how people find and use
            this site, so we can improve it. We don&rsquo;t use marketing cookies. If you decline,
            nothing is stored and the site works just the same.
          </Text>
        </div>
        <Group gap="sm" wrap="nowrap" className={classes.actions}>
          <Button size="sm" color="rgwBlue" onClick={() => choose('granted')}>
            Accept analytics
          </Button>
          <Button size="sm" variant="default" onClick={() => choose('denied')}>
            Decline
          </Button>
        </Group>
      </div>
    </Paper>
  );
}
