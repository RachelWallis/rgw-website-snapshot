import type { Metadata } from 'next';
import { IconBrandGoogle, IconStarFilled } from '@tabler/icons-react';
import { Button, Container, Group, Stack, Text } from '@mantine/core';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { ReviewsTeaser } from '@/components/ReviewsTeaser/ReviewsTeaser';
import { getGoogleReviews } from '@/lib/google-reviews';

export const metadata: Metadata = {
  title: 'Leave a review',
  description:
    'Enjoyed our service? Leave RGW Heating & Plumbing a Google review, it really helps other South Hampshire homeowners find us.',
};

export default async function LeaveAReviewPage() {
  const { reviews, averageRating, totalRatings } = await getGoogleReviews(12);

  return (
    <>
      <PhotoBand
        src="/images/bg/Worcester_Bosch_Greenstar_Ri_Utility_HERO.jpg"
        title="Leave us a review"
      />

      <section>
        <Container size="md" py={{ base: 60, md: 100 }}>
          <Stack gap="lg" ta="center" align="center">
            <Group gap={4}>
              {Array.from({ length: 5 }).map((_, i) => (
                <IconStarFilled key={i} size={28} color="var(--mantine-color-rgwOrange-6)" />
              ))}
            </Group>
            <Text size="lg" c="dimmed" maw={560}>
              Thanks for choosing RGW Heating &amp; Plumbing. A quick Google review really helps
              other South Hampshire homeowners find us.
            </Text>

            <Button
              component="a"
              href="/review"
              size="xl"
              color="rgwOrange"
              leftSection={<IconBrandGoogle size={20} />}
            >
              Leave a Google review
            </Button>
          </Stack>
        </Container>
      </section>

      <ReviewsTeaser
        heading="Recent reviews"
        subheading={
          averageRating && totalRatings
            ? `Averaging ${averageRating.toFixed(1)} stars across ${totalRatings} Google reviews.`
            : 'What our customers have said.'
        }
        reviews={reviews}
        showViewAllLink={false}
      />
    </>
  );
}
