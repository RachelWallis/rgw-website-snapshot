import type { Metadata } from 'next';
import { IconBrandWhatsapp, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import { Anchor, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { business } from '@/lib/business';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact us',
  description:
    'Get in touch with RGW Heating & Plumbing. Call 07969 110679, email richard@rgwplumbing.co.uk or send us a message.',
};

export default function ContactUsPage() {
  return (
    <>
      <PhotoBand src="/images/bg/CDi_Compact_-_Lifestyle.jpg" title="Contact us" />

      <section>
        <Container size="lg" py={{ base: 60, md: 100 }}>
          <Stack gap="xs" ta="center" mb="xl">
            <Text c="dimmed" size="lg" maw={640} mx="auto">
              Drop us a line for a quote, a service booking or an emergency call-out.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'xl', md: 60 }}>
            <Stack gap="lg">
              <Title order={2} size="h3">
                Get in touch
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

              <Group gap="sm" wrap="nowrap">
                <IconBrandWhatsapp size={20} color="var(--mantine-color-rgwBlue-6)" />
                <Anchor
                  href={business.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  fw={500}
                >
                  Message us on WhatsApp
                </Anchor>
              </Group>

              <Group gap="sm" wrap="nowrap" align="flex-start">
                <IconMapPin size={20} color="var(--mantine-color-rgwBlue-6)" />
                <div>
                  <Text fw={500}>Service area</Text>
                  <Text c="dimmed" size="sm">
                    South Hampshire
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

            {/* prefillFromEnquiry: arrivals from a "Request a boiler service"
                link get the message already written. See lib/enquiries.ts. */}
            <ContactForm prefillFromEnquiry />
          </SimpleGrid>
        </Container>
      </section>
    </>
  );
}
