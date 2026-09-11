import type { Metadata } from 'next';
import {
  Anchor,
  Button,
  Card,
  Container,
  Group,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { townPages } from '@/content/town-pages';
import { business } from '@/lib/business';
import { areasByTier, formatAreaLabel, type CoverageTier } from '@/lib/service-areas';

/**
 * RGW-026: the 43 near-duplicate `/[landing]` pages were consolidated into
 * 10 real `/areas/<town>` pages (content/town-pages.ts). This maps every
 * service-area name that used to have (or fed into) one of those pages to
 * the town page that now covers it, so this hub links to real content
 * instead of a dead slug. Names not listed here never had their own page.
 */
const townPageForArea: Record<string, string> = {
  Eastleigh: 'eastleigh',
  Allbrook: 'eastleigh',
  Bishopstoke: 'bishopstoke',
  "Chandler's Ford": 'chandlers-ford',
  Hiltingbury: 'chandlers-ford',
  'Fair Oak': 'fair-oak',
  'Horton Heath': 'fair-oak',
  'Hedge End': 'hedge-end',
  'Boorley Green': 'hedge-end',
  Winchester: 'winchester',
  Compton: 'winchester',
  Otterbourne: 'winchester',
  Twyford: 'winchester',
  Hockley: 'winchester',
  Owslebury: 'winchester',
  'Colden Common': 'winchester',
  Alresford: 'winchester',
  Southampton: 'southampton',
  Romsey: 'romsey',
  Ampfield: 'romsey',
  'North Baddesley': 'romsey',
  "Bishop's Waltham": 'bishops-waltham',
  Upham: 'bishops-waltham',
  Durley: 'bishops-waltham',
  Botley: 'botley',
};

export const metadata: Metadata = {
  title: 'Areas we cover',
  description:
    'Based in Bishopstoke near Eastleigh, RGW Heating & Plumbing covers Eastleigh, Chandler’s Ford, Winchester, Hedge End, Southampton, Romsey and the surrounding South Hampshire area.',
};

type Tier = {
  key: string;
  heading: string;
  intro: string;
  /** Coverage tiers whose postcodes feed this card's list. Omit for a note-only card. */
  sourceTiers?: CoverageTier[];
};

const tiers: Tier[] = [
  {
    key: 'core',
    heading: 'Areas we cover every day',
    intro:
      'Our home patch, around the base in Bishopstoke and Eastleigh. Same-day where we can, next-day for anything not urgent.',
    sourceTiers: ['core'],
  },
  {
    key: 'regular',
    heading: 'Regular coverage',
    intro: 'From Winchester and Southampton to the villages in between.',
    sourceTiers: ['mid', 'wider'],
  },
  {
    key: 'further',
    heading: 'Also happy to travel to',
    intro: 'Will travel approx 1 hour from Bishopstoke on request.',
  },
];

export default function ServiceAreasPage() {
  return (
    <>
      <PhotoBand src="/images/bg/Ri_-_Lifestyle.jpg" title="Areas we cover" />

      <section>
        <Container size="lg" py={{ base: 60, md: 100 }}>
          <Stack gap="xs" ta="center" mb="xl">
            <Text c="dimmed" size="lg" maw={720} mx="auto">
              Based in Bishopstoke, near Eastleigh. We cover Southampton, Winchester and everywhere
              in between, here&rsquo;s where we go.
            </Text>
          </Stack>

          <Title order={2} size="h3" ta="center" mb="md">
            Ten towns, ten real pages
          </Title>
          <Text c="dimmed" ta="center" maw={640} mx="auto" mb="lg">
            Each covers new boilers, servicing and emergencies for that town specifically — not a
            template with the name swapped in.
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md" mb={60}>
            {townPages.map((t) => (
              <Anchor
                key={t.slug}
                component="a"
                href={`/areas/${t.slug}`}
                ta="center"
                p="sm"
                style={{ borderRadius: 'var(--mantine-radius-md)' }}
              >
                {t.name}
              </Anchor>
            ))}
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {tiers.map((tier) => {
              const areas = (tier.sourceTiers ?? []).flatMap((t) => areasByTier(t));
              return (
                <Card key={tier.key} shadow="sm" padding="xl" radius="lg" withBorder h="100%">
                  <Stack gap="md" h="100%">
                    <div>
                      <Title order={2} size="h4" mb={4}>
                        {tier.heading}
                      </Title>
                      <Text c="dimmed" size="sm">
                        {tier.intro}
                      </Text>
                    </div>
                    {areas.length > 0 && (
                      <List
                        spacing={4}
                        size="sm"
                        styles={{ itemWrapper: { display: 'block' } }}
                        listStyleType="none"
                        withPadding={false}
                      >
                        {areas.map((area) => {
                          const townSlug = townPageForArea[area.name];
                          return (
                            <ListItem key={area.name}>
                              {townSlug ? (
                                <Anchor component="a" href={`/areas/${townSlug}`} size="sm">
                                  {formatAreaLabel(area)}
                                </Anchor>
                              ) : (
                                formatAreaLabel(area)
                              )}
                            </ListItem>
                          );
                        })}
                      </List>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>

          <Stack gap="xs" ta="center" mt={60} maw={640} mx="auto">
            <Title order={2} size="h3">
              Somewhere else? Get in touch.
            </Title>
            <Text c="dimmed">
              If you&rsquo;re close to the area and not sure whether we&rsquo;ll come out, give us a
              call on <Anchor href={`tel:${business.phoneE164}`}>{business.phoneDisplay}</Anchor>,
              the answer is usually yes.
            </Text>
            <Group justify="center" mt="md">
              <Button component="a" href="/get-a-quote" size="md" color="rgwOrange">
                Get a quote
              </Button>
            </Group>
          </Stack>
        </Container>
      </section>
    </>
  );
}
