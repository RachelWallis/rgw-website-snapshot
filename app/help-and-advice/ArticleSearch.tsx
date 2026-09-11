'use client';

import { useMemo, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Card, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import type { ArticleSummary } from '@/sanity/queries';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ArticleSearch({ articles }: { articles: ArticleSummary[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return articles;
    }
    return articles.filter(
      (a) => a.title.toLowerCase().includes(term) || (a.excerpt ?? '').toLowerCase().includes(term)
    );
  }, [query, articles]);

  return (
    <Stack gap="xl">
      <TextInput
        size="md"
        radius="xl"
        placeholder="Search guides…"
        aria-label="Search guides"
        leftSection={<IconSearch size={18} />}
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        w="100%"
        maw={440}
        mx="auto"
      />

      {filtered.length === 0 ? (
        <Text ta="center" c="dimmed">
          No guides match &ldquo;{query}&rdquo; yet. Try a different search, or{' '}
          <a href="/contact-us">ask us directly</a>.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {filtered.map((a) => (
            <Card
              key={a._id}
              component="a"
              href={`/help-and-advice/${a.slug}`}
              shadow="sm"
              padding="lg"
              radius="lg"
              withBorder
              style={{ display: 'block' }}
            >
              <Stack gap="sm">
                <Text size="xs" c="dimmed">
                  {formatDate(a.publishedAt)}
                </Text>
                <Title order={3} size="h4">
                  {a.title}
                </Title>
                {a.excerpt && (
                  <Text c="dimmed" lineClamp={3}>
                    {a.excerpt}
                  </Text>
                )}
                <Text c="rgwBlue.7" fw={500} size="sm">
                  Read more →
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
