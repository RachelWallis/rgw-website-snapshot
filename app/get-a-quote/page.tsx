import type { Metadata } from 'next';
import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import { Anchor, Container, Divider, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { ContactForm } from '@/app/contact-us/ContactForm';
import { InstantQuoteSection } from '@/components/InstantQuote/InstantQuoteSection';
import { business } from '@/lib/business';
import { pageOpenGraph } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Free instant boiler quote',
  description:
    'Answer a few quick questions and get an instant, no-obligation price for a new boiler in Eastleigh, Winchester, Southampton and across South Hampshire. Fitted prices, confirmed and locked in at a free survey.',
  openGraph: pageOpenGraph('quote'),
};

export default function GetAQuotePage() {
  return (
    <section>
      <Container size="lg" py={{ base: 40, md: 80 }}>
        <Stack gap="xs" ta="center" mb="xl">
          <Title order={1}>Get your instant boiler quote</Title>
          <Text c="dimmed" size="lg" maw={640} mx="auto">
            A few quick questions and an indicative fitted price on the spot. A free survey then
            confirms and locks in your price, no obligation.
          </Text>
        </Stack>

        <InstantQuoteSection />

        <Divider my={60} label="Rather just tell us what you need?" labelPosition="center" />

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: 60 }}>
          <Stack gap="lg">
            <Title order={2} size="h3">
              Prefer to talk?
            </Title>

            <Group gap="sm" wrap="nowrap">
              <IconPhone size={20} color="var(--mantine-color-rgwBlue-6)" />
              <Anchor href={`tel:${business.phoneE164}`} fw={500}>
                {business.phoneDisplay}
              </Anchor>
            </Group>

            <Group gap="sm" wrap="nowrap">
              <IconMail size={20} color="var(--mantine-color-rgwBlue-6)" />
              <Anchor href={`mailto:${business.email}`} fw={500}>
                {business.email}
              </Anchor>
            </Group>

            <Group gap="sm" wrap="nowrap" align="flex-start">
              <IconMapPin size={20} color="var(--mantine-color-rgwBlue-6)" />
              <div>
                <Text fw={500}>Service area</Text>
                <Text c="dimmed" size="sm">
                  Eastleigh, Winchester, Southampton and around{' '}
                  <Anchor href="/areas-we-cover" size="sm">
                    (see where we work)
                  </Anchor>
                </Text>
              </div>
            </Group>

            <div>
              <Text fw={500} mb={4}>
                Hours
              </Text>
              <Text c="dimmed" size="sm">
                Booked work: {business.hours.standardLabel}. Emergencies: any hour, any day — just
                call.
              </Text>
            </div>
          </Stack>

          <ContactForm context="quote" />
        </SimpleGrid>
      </Container>
    </section>
  );
}
