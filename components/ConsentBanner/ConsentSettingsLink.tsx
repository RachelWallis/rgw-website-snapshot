'use client';

import { Anchor } from '@mantine/core';
import { isAnalyticsConfigured, openConsentSettings } from '@/lib/analytics';

/**
 * Footer link that reopens the consent banner so visitors can change their
 * mind at any time (GDPR: withdrawing consent must be as easy as giving it).
 * Renders nothing when analytics is not configured (no banner to reopen).
 */
export function ConsentSettingsLink() {
  if (!isAnalyticsConfigured()) {
    return null;
  }
  return (
    <Anchor component="button" type="button" size="xs" c="gray.4" onClick={openConsentSettings}>
      Cookie settings
    </Anchor>
  );
}
