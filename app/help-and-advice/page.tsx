import type { Metadata } from 'next';
import { Alert, Anchor, Container, Stack, Text } from '@mantine/core';
import { PhotoBand } from '@/components/PhotoBand/PhotoBand';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';
import { pageOpenGraph } from '@/lib/og';
import { isSanityConfigured } from '@/sanity/env';
import { getAllArticles } from '@/sanity/queries';
import { ArticleSearch } from './ArticleSearch';

export const metadata: Metadata = {
  title: 'Help & advice',
  description:
    'Practical heating and plumbing advice from RGW, boiler sizing, powerflushing, winter prep and more.',
  openGraph: pageOpenGraph('helpAndAdvice'),
};

export default async function HelpAndAdvicePage() {
  const articles = await getAllArticles();
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <>
      <PhotoBand src="/images/bg/4000_Traditional_Kitchen_copy.jpg" title="Help & advice" />

      <section>
        <Container size="lg" py={{ base: 60, md: 100 }}>
          <Stack gap="xs" ta="center" mb="xl">
            <Text c="dimmed" size="lg" maw={640} mx="auto">
              Practical guides on getting the best out of your heating and plumbing.
            </Text>
            <Text size="md" maw={640} mx="auto">
              Wondering what size boiler you need? Try the{' '}
              <Anchor href="/collection/boiler-kw-calculator">boiler kW calculator</Anchor>: five
              quick answers, same rules as our instant quote.
            </Text>
          </Stack>

          {isDev && !isSanityConfigured && (
            <Alert color="yellow" title="Sanity CMS not configured (dev only)" mb="lg">
              Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{' '}
              <code>NEXT_PUBLIC_SANITY_DATASET</code> to <code>.env.local</code>, then create
              articles at <code>/studio</code>. They&rsquo;ll appear here automatically.
            </Alert>
          )}

          {isDev && isSanityConfigured && articles.length === 0 && (
            <Alert color="blue" title="No articles yet (dev only)" mb="lg">
              Once you publish articles in <Anchor href="/studio">/studio</Anchor>, they&rsquo;ll
              appear here.
            </Alert>
          )}

          {articles.length === 0 && (
            <Text ta="center" c="dimmed" size="lg">
              We&rsquo;re writing our first guides now, check back soon. In the meantime, if you
              have a heating or plumbing question, <Anchor href="/contact-us">get in touch</Anchor>{' '}
              and we&rsquo;ll happily help.
            </Text>
          )}

          {articles.length > 0 && <ArticleSearch articles={articles} />}
        </Container>
      </section>

      <QuoteCta />
    </>
  );
}
