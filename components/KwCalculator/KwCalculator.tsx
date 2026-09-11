'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  NativeSelect,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { PillButton } from '@/components/PillButton/PillButton';
import { track } from '@/lib/analytics';
import {
  bandParam,
  BATH_OPTIONS,
  BEDROOM_OPTIONS,
  CURRENT_BOILER_OPTIONS,
  PROPERTY_OPTIONS,
  quotePrefillQuery,
  resolveSizeBand,
  SHOWER_OPTIONS,
  type CurrentBoiler,
  type PropertyType,
  type SizeBand,
  type SizeInput,
} from '@/lib/boiler-size';

const TIER_LABEL = { value: 'Value', mid: 'Mid-range', premium: 'Premium' } as const;

/**
 * The boiler kW calculator (RGW-054, QD-056). Sizing comes from quote-direct's
 * GET /api/size via lib/boiler-size.ts, the same engine and live catalogue the
 * quote funnel uses, so what this shows is what the funnel offers. If the
 * endpoint cannot answer, the local snapshot answers instead and the result
 * says so. The "Get your fitted price" button carries the answers into
 * /get-a-quote as the funnel's own option labels (see QuoteFunnel's prefill),
 * so the customer confirms rather than re-enters.
 */
export function KwCalculator() {
  const [bedrooms, setBedrooms] = useState('3');
  const [baths, setBaths] = useState('1');
  const [showers, setShowers] = useState('1');
  const [propertyType, setPropertyType] = useState<PropertyType>('Semi-Detached');
  const [currentBoiler, setCurrentBoiler] = useState<CurrentBoiler>('Combi Boiler');
  const [shown, setShown] = useState(false);

  const input: SizeInput = useMemo(
    () => ({
      bedrooms: Number(bedrooms),
      baths: Number(baths),
      showers: Number(showers),
      propertyType,
      currentBoiler,
    }),
    [bedrooms, baths, showers, propertyType, currentBoiler]
  );
  // The band for the answers it was sized from; a changed answer re-sizes.
  const [result, setResult] = useState<{ input: SizeInput; band: SizeBand } | null>(null);
  const trackNext = useRef(false);
  const loading = shown && result?.input !== input;
  const band = result?.band ?? null;

  useEffect(() => {
    if (!shown) {
      return undefined;
    }
    const controller = new AbortController();
    resolveSizeBand(input, { signal: controller.signal }).then((sized) => {
      if (controller.signal.aborted) {
        return;
      }
      setResult({ input, band: sized });
      if (trackNext.current) {
        trackNext.current = false;
        // Consent-gated inside track(); dropped, never queued, before consent.
        track('kw_calculator_used', {
          band: bandParam(sized),
          size_band: sized.label,
          bedrooms: sized.bedrooms,
          high_demand: sized.highDemand,
          suggest_system: sized.suggestSystem,
          source: sized.source,
        });
      }
    });
    return () => controller.abort();
  }, [input, shown]);

  function show() {
    trackNext.current = true;
    setShown(true);
  }

  const segment = (opts: readonly { value: number; label: string }[]) =>
    opts.map((o) => ({ value: String(o.value), label: o.label.split(' ')[0] }));

  return (
    <Card withBorder radius="lg" p={{ base: 'md', sm: 'xl' }}>
      <Stack gap="lg">
        <Stack gap={6}>
          <Text fw={600}>How many bedrooms?</Text>
          <SegmentedControl
            fullWidth
            color="rgwBlue"
            value={bedrooms}
            onChange={setBedrooms}
            data={segment(BEDROOM_OPTIONS)}
            aria-label="Bedrooms"
          />
        </Stack>

        <Stack gap={6}>
          <Text fw={600}>How many bath tubs?</Text>
          <SegmentedControl
            fullWidth
            color="rgwBlue"
            value={baths}
            onChange={setBaths}
            data={segment(BATH_OPTIONS)}
            aria-label="Bath tubs"
          />
        </Stack>

        <Stack gap={6}>
          <Text fw={600}>How many separate showers?</Text>
          <Text size="sm" c="dimmed">
            Count showers in their own cubicle, not one over the bath.
          </Text>
          <SegmentedControl
            fullWidth
            color="rgwBlue"
            value={showers}
            onChange={setShowers}
            data={segment(SHOWER_OPTIONS)}
            aria-label="Separate showers"
          />
        </Stack>

        <NativeSelect
          label="What sort of property is it?"
          size="md"
          value={propertyType}
          onChange={(e) => setPropertyType(e.currentTarget.value as PropertyType)}
          data={[...PROPERTY_OPTIONS]}
        />

        <NativeSelect
          label="What type of boiler do you have now?"
          size="md"
          value={currentBoiler}
          onChange={(e) => setCurrentBoiler(e.currentTarget.value as CurrentBoiler)}
          data={[...CURRENT_BOILER_OPTIONS]}
        />

        {!shown && (
          <Button color="rgwBlue" size="md" radius="xl" onClick={show}>
            Show my boiler size
          </Button>
        )}

        {shown && loading && !band && (
          <Group gap="sm" role="status" aria-live="polite">
            <Loader size="sm" color="rgwBlue" />
            <Text size="sm" c="dimmed">
              Working out your size…
            </Text>
          </Group>
        )}

        {shown && band && (
          <Card
            radius="md"
            p="lg"
            bg="var(--rgw-sage-soft)"
            data-testid="kw-result"
            data-source={band.source}
            aria-busy={loading}
          >
            <Stack gap="sm">
              <Group gap="xs">
                <Badge color="rgwBlue" variant="light" size="lg" radius="sm">
                  {band.label}
                </Badge>
              </Group>
              <Title order={2} size="h2">
                {band.kwText} combi
              </Title>
              <Text size="sm" c="dimmed">
                {band.picks.map((p) => `${TIER_LABEL[p.tier]}: ${p.kw} kW ${p.model}`).join(' · ')}
              </Text>
              <Text>{band.guidance}</Text>
              {band.source === 'fallback' && (
                <Text size="sm" c="dimmed" data-testid="kw-fallback-note">
                  We couldn&rsquo;t reach our live sizing rules just now, so this uses our own copy
                  of them. Your instant quote always uses the latest.
                </Text>
              )}
              <Text size="sm" c="dimmed">
                This is indicative, from the same rules our instant quote uses. The free survey
                confirms the size before anything is ordered.
              </Text>
              <Group mt="xs">
                <PillButton href={`/get-a-quote?${quotePrefillQuery(input)}`}>
                  Get your fitted price
                </PillButton>
              </Group>
            </Stack>
          </Card>
        )}
      </Stack>
    </Card>
  );
}
