import type { Metadata } from 'next';
import { Anchor, Button, Container, Divider, Group, Stack, Text, Title } from '@mantine/core';
import { business } from '@/lib/business';

export const metadata: Metadata = {
  title: 'Page not found',
};

const popularPages = [
  { label: 'What we do', href: '/what-we-do' },
  { label: 'Areas we cover', href: '/areas-we-cover' },
  { label: 'Help & advice', href: '/help-and-advice' },
  { label: 'Meet the team', href: '/meet-the-team' },
  { label: 'Contact us', href: '/contact-us' },
];

export default function NotFound() {
  return (
    <section>
      <Container size="md" py={{ base: 80, md: 140 }}>
        <Stack gap="md" ta="center" align="center">
          <Title order={1}>Page not found</Title>
          <Text c="dimmed" size="lg" maw={560}>
            That page doesn&rsquo;t exist, but we&rsquo;re still here. If you need a plumber or
            heating engineer, give us a call: {business.hours.emergencyLabel.toLowerCase()}.
          </Text>
          <Group mt="md" justify="center">
            <Button component="a" href={`tel:${business.phoneE164}`} color="rgwOrange" size="md">
              Call {business.phoneDisplay}
            </Button>
            <Button component="a" href="/get-a-quote" color="rgwBlue" size="md">
              Get an instant quote
            </Button>
            <Button component="a" href="/" variant="light" color="rgwBlue" size="md">
              Back to home
            </Button>
          </Group>
          <Divider w="100%" maw={560} my="md" label="Looking for one of these?" />
          <Group gap="lg" justify="center">
            {popularPages.map((page) => (
              <Anchor key={page.href} href={page.href} fw={600}>
                {page.label}
              </Anchor>
            ))}
          </Group>
        </Stack>
      </Container>
    </section>
  );
}
