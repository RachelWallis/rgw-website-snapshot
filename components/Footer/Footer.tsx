import Link from 'next/link';
import { IconBrandWhatsapp, IconMail, IconPhone } from '@tabler/icons-react';
import { Anchor, Container, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { ConsentSettingsLink } from '@/components/ConsentBanner/ConsentSettingsLink';
import { business } from '@/lib/business';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container size="lg" py="xl">
        <div className={classes.grid}>
          <Stack gap="xs">
            <Title order={3} c="white">
              RGW Heating &amp; Plumbing
            </Title>
            <Text size="sm" c="gray.3">
              Heating &amp; Plumbing experts in South Hampshire.
            </Text>
            <Text size="sm" c="gray.3">
              Based in Eastleigh. We cover Winchester, Southampton, Romsey and everywhere in
              between.
            </Text>
            <Text size="sm" c="gray.3">
              Gas Safe registered: <strong>{business.gasSafeNumber}</strong>
            </Text>
            <Anchor
              href={business.gasSafeUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              c="rgwOrange.4"
            >
              Check the Gas Safe register →
            </Anchor>
          </Stack>

          <Stack gap="xs">
            <Title order={4} c="white">
              Contact
            </Title>
            <Group gap="xs" wrap="nowrap">
              <IconBrandWhatsapp size={16} />
              <Anchor
                href={business.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                c="white"
                size="sm"
              >
                WhatsApp
              </Anchor>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <IconPhone size={16} />
              <Anchor href={`tel:${business.phoneE164}`} c="white" size="sm">
                {business.phoneDisplay}
              </Anchor>
            </Group>
            <Group gap="xs" wrap="nowrap">
              <IconMail size={16} />
              <Anchor href={`mailto:${business.email}`} c="white" size="sm">
                {business.email}
              </Anchor>
            </Group>
          </Stack>

          <Stack gap="xs">
            <Title order={4} c="white">
              Services
            </Title>
            <Anchor component={Link} href="/what-we-do/boiler-services" c="white" size="sm">
              Boiler services &amp; repairs
            </Anchor>
            <Anchor component={Link} href="/what-we-do/gas-central-heating" c="white" size="sm">
              Gas central heating
            </Anchor>
            <Anchor
              component={Link}
              href="/what-we-do/landlord-safety-certificates"
              c="white"
              size="sm"
            >
              Landlord certificates
            </Anchor>
            <Anchor component={Link} href="/what-we-do/radiator-installation" c="white" size="sm">
              Radiators
            </Anchor>
            <Anchor component={Link} href="/what-we-do/general-plumbing" c="white" size="sm">
              General plumbing
            </Anchor>
            <Anchor component={Link} href="/what-we-do/powerflushing" c="white" size="sm">
              Powerflushing
            </Anchor>
          </Stack>

          <Stack gap="xs">
            <Title order={4} c="white">
              Site
            </Title>
            <Anchor component={Link} href="/what-we-do" c="white" size="sm">
              What we do
            </Anchor>
            <Anchor component={Link} href="/areas-we-cover" c="white" size="sm">
              Areas we cover
            </Anchor>
            <Anchor component={Link} href="/help-and-advice" c="white" size="sm">
              Help &amp; advice
            </Anchor>
            <Anchor component={Link} href="/meet-the-team" c="white" size="sm">
              Meet the team
            </Anchor>
            <Anchor component={Link} href="/review" c="white" size="sm">
              Leave a review
            </Anchor>
            <Anchor component={Link} href="/contact-us" c="white" size="sm">
              Contact us
            </Anchor>
          </Stack>
        </div>

        <Divider my="lg" color="gray.7" />

        <Group justify="space-between">
          <Text size="xs" c="gray.4">
            {`© ${new Date().getFullYear()} RGW Heating & Plumbing. All rights reserved.`}
          </Text>
          <Group gap="md">
            <Anchor component={Link} href="/privacy-policy" c="gray.4" size="xs">
              Privacy &amp; cookies
            </Anchor>
            <ConsentSettingsLink />
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
