import { IconBolt, IconClock24, IconShieldCheck } from '@tabler/icons-react';
import { Card, Container, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';

const usps = [
  {
    icon: IconBolt,
    title: 'Fast Service',
    body: 'We always aim to get to you as quickly as we can. Emergency cover is available 24 hours a day.',
  },
  {
    icon: IconShieldCheck,
    title: 'Gas Safe Registered',
    body: 'Our engineers are certified Gas Safe (#503986) for your assurance of safe, compliant heating services.',
  },
  {
    icon: IconClock24,
    title: 'Available 24 Hours',
    body: 'Around the clock, our team is ready to assist. 24/7 support for all your heating and plumbing needs.',
  },
];

export function Usps() {
  return (
    <section>
      <Container size="lg" py={{ base: 60, md: 100 }}>
        <Stack gap="xs" ta="center" mb="xl">
          <Title order={2}>Here for you when you need us</Title>
          <Text c="dimmed" size="lg">
            Trusted heating and plumbing in South Hampshire.
          </Text>
        </Stack>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          {usps.map((u) => (
            <Card key={u.title} shadow="sm" padding="xl" radius="lg" withBorder>
              <ThemeIcon size={56} radius="lg" color="rgwOrange" variant="light" mb="md">
                <u.icon size={32} />
              </ThemeIcon>
              <Title order={3} size="h4" mb="xs">
                {u.title}
              </Title>
              <Text c="dimmed">{u.body}</Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}
