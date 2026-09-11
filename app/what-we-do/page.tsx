import type { Metadata } from 'next';
import { Container, Stack, Text } from '@mantine/core';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { serviceCards } from '@/components/ProblemsSolved/ProblemsSolved';
import { ServiceCardGrid } from '@/components/ProblemsSolved/ServiceCardGrid';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';

export const metadata: Metadata = {
  title: 'What we do',
  description:
    'Gas central heating, boiler services, landlord safety certificates, radiator installation, general plumbing and powerflushing across South Hampshire.',
};

export default function WhatWeDoPage() {
  return (
    <>
      <PhotoBand
        src="/images/bg/Worcester_Bosch_Greenstar_CDi_Compact_Shaker_HERO_Lifestyle.jpg"
        title="What we do"
      />

      <section>
        <Container size="lg" py={{ base: 60, md: 100 }}>
          <Stack gap="xs" ta="center" mb="xl">
            <Text c="dimmed" size="lg" maw={640} mx="auto">
              From an annual boiler service to a full central heating install, we cover the lot
              across South Hampshire.
            </Text>
          </Stack>

          <ServiceCardGrid items={serviceCards} />
        </Container>
      </section>

      <QuoteCta />
    </>
  );
}
