import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { escapeHTML, type PortableTextHtmlComponents } from '@portabletext/to-html';
import { Anchor, Container, Stack, Text, Title } from '@mantine/core';
import { QuoteCta } from '@/components/QuoteCta/QuoteCta';
import styles from '@/lib/articleBody.module.css';
import { ArticleBodyErrorBoundary } from '@/lib/ArticleBodyErrorBoundary';
import { ArticleBodyUnavailable } from '@/lib/ArticleBodyUnavailable';
import { business } from '@/lib/business';
import { pageOpenGraph } from '@/lib/og';
import { portableTextToHtmlComponents } from '@/lib/portableTextToHtmlComponents';
import { renderArticleBodyHtml } from '@/lib/renderArticleBodyHtml';
import { articleSchema, breadcrumbSchema, jsonLdScriptProps } from '@/lib/schema';
import { urlForImage } from '@/sanity/client';
import { getAllArticleSlugs, getArticleBySlug } from '@/sanity/queries';

// Adds the `image` type on top of the sanity-free block/marks map — same
// layering `portableTextComponents.tsx` used to use for the React
// renderer (see lib/renderArticleBodyHtml.ts's comment for why this lives
// in page.tsx rather than in a module the unit test also imports).
const articlePageHtmlComponents: Partial<PortableTextHtmlComponents> = {
  ...portableTextToHtmlComponents,
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1200).fit('max').url();
      if (!url) {
        return '';
      }
      // `alt` is free-text an editor fills in, so it's escaped like any
      // other body text; `url` is Sanity's own CDN URL builder output,
      // not free text, but escaped too since it costs nothing.
      const alt = typeof value?.alt === 'string' ? value.alt : '';
      return `<img src="${escapeHTML(url)}" alt="${escapeHTML(alt)}" loading="lazy" />`;
    },
  },
};

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: 'Not found' };
  }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: pageOpenGraph('helpAndAdvice', {
      title: article.title,
      description: article.excerpt,
    }),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  const cover = urlForImage(article.coverImage)?.width(1600).fit('max').url();
  const articleUrl = `${business.url}/help-and-advice/${slug}`;

  // RGW-028, third attempt: rendered synchronously here, inside this
  // Server Component's own execution, specifically so that a throw during
  // rendering is an ordinary function throw a plain try/catch can catch —
  // see lib/renderArticleBodyHtml.ts for why the previous two attempts
  // (filling out component maps, then a React Error Boundary) couldn't
  // catch this. `null` means the render threw; `ArticleBodyErrorBoundary`
  // below is kept as a second, independent safety net for anything else
  // in this subtree, not for this specific call.
  const bodyHtml = article.body
    ? renderArticleBodyHtml(article.body, slug, articlePageHtmlComponents)
    : null;

  return (
    <>
      <script
        {...jsonLdScriptProps(
          articleSchema({
            title: article.title,
            description: article.excerpt,
            url: articleUrl,
            image: cover,
            datePublished: article.publishedAt,
            dateModified: article._updatedAt,
          })
        )}
      />
      <script
        {...jsonLdScriptProps(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Help & advice', path: '/help-and-advice' },
            { name: article.title, path: `/help-and-advice/${slug}` },
          ])
        )}
      />
      <article>
        <Container size="md" py={{ base: 40, md: 80 }}>
          <Anchor href="/help-and-advice" size="sm" mb="lg" display="inline-block">
            ← All articles
          </Anchor>

          <Stack gap="xs" mb="xl">
            <Text size="sm" c="dimmed">
              {formatDate(article.publishedAt)}
            </Text>
            <Title order={1}>{article.title}</Title>
            {article.excerpt && (
              <Text c="dimmed" size="lg">
                {article.excerpt}
              </Text>
            )}
          </Stack>

          {cover && (
            <div style={{ margin: '0 0 2rem' }}>
              <Image
                src={cover}
                alt={article.coverImage?.alt ?? article.title}
                width={1600}
                height={900}
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                preload
                fetchPriority="high"
              />
            </div>
          )}

          {article.body ? (
            <ArticleBodyErrorBoundary slug={slug}>
              {bodyHtml !== null ? (
                <div className={styles.body} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              ) : (
                <ArticleBodyUnavailable />
              )}
            </ArticleBodyErrorBoundary>
          ) : (
            <Text c="dimmed">This article has no content yet.</Text>
          )}
        </Container>
      </article>

      <QuoteCta />
    </>
  );
}
