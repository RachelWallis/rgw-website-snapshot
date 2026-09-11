import type { Metadata } from 'next';
import Image from 'next/image';
import { Box, Card, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';

export const metadata: Metadata = {
  title: 'Meet the team',
  description:
    'Meet Rich and Kai, the Gas Safe registered engineers behind RGW Heating & Plumbing. A genuinely local firm serving South Hampshire since 2009, where the person who quotes is the person who turns up.',
};

type Member = {
  name: string;
  role: string;
  bio: string;
};

// Left-to-right order matches the team photo above the cards (Kai left, Rich right).
const team: Member[] = [
  {
    name: 'Kai',
    role: 'Heating & Plumbing Engineer',
    bio: 'Kai is a qualified gas engineer and has been with RGW Heating and Plumbing since 2021. Kai enjoys travel, fitness and snowboarding.',
  },
  {
    name: 'Rich',
    role: 'Senior Heating & Plumbing Engineer',
    bio: 'Over 30 years experience in heating and plumbing. Rich established RGW in 2009. Outside of work he spends time with his family and out on the boat.',
  },
];

export default function MeetTheTeamPage() {
  return (
    <>
      <PhotoBand src="/images/bg/welcome.jpg" title="Meet the team" />

      <section>
        <Container size="lg" py={{ base: 60, md: 100 }}>
          <Text size="lg" maw={720} mx="auto" ta="center" mb="xl">
            RGW is a two-man firm and proud of it. When you book us, the person who priced the job
            is the person who does it, Gas Safe registered (503986), trading since 2009, and busy
            mostly through word of mouth around Eastleigh, Winchester and Southampton.
          </Text>

          {/* One shared team photo (RGW-020) sits centred above the two cards rather than a
              per-person avatar: the supplied asset is a single landscape shot of both engineers. */}
          <Box maw={520} mx="auto" mb="md">
            <Image
              src="/images/rich-kai.jpg"
              alt="Kai and Rich, the two Gas Safe engineers behind RGW Heating & Plumbing"
              width={1518}
              height={1019}
              sizes="(max-width: 600px) 100vw, 520px"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: 'var(--mantine-radius-lg)',
              }}
            />
          </Box>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" maw={800} mx="auto">
            {team.map((m) => (
              <Card key={m.name} shadow="sm" padding="xl" radius="lg" withBorder>
                <Stack gap="md" align="center" ta="center">
                  <div>
                    <Title order={3}>{m.name}</Title>
                    <Text c="rgwOrange.7" fw={600}>
                      {m.role}
                    </Text>
                  </div>
                  <Text c="dimmed">{m.bio}</Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <QuoteCta />
    </>
  );
}
