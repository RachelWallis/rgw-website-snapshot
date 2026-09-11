import type { PortableTextComponents } from 'next-sanity';
import { Anchor, List, Text, Title } from '@mantine/core';

/**
 * Text/heading/list/link rendering for Help & Advice article bodies, kept
 * in its own module with no dependency on sanity/client.ts (and, through
 * it, next-sanity's full barrel export, which pulls in the Sanity Studio
 * visual-editing package tree). That split is what lets content tests
 * render drafted article bodies through the exact same block styling the
 * live article page uses, without next.config.mjs's `transpilePackages`
 * needing to cover half the Sanity ecosystem just for a jest run.
 *
 * portableTextComponents.tsx composes this with the `image` type handler
 * for the live page; import from here directly wherever a body has no
 * images to render (e.g. content/help-articles/__tests__).
 */
export const portableTextBlockComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <Title order={1} mt="xl" mb="md">
        {children}
      </Title>
    ),
    h2: ({ children }) => (
      <Title order={2} mt="xl" mb="md">
        {children}
      </Title>
    ),
    h3: ({ children }) => (
      <Title order={3} mt="lg" mb="sm">
        {children}
      </Title>
    ),
    h4: ({ children }) => (
      <Title order={4} mt="lg" mb="sm">
        {children}
      </Title>
    ),
    h5: ({ children }) => (
      <Title order={5} mt="md" mb="xs">
        {children}
      </Title>
    ),
    h6: ({ children }) => (
      <Title order={6} mt="md" mb="xs">
        {children}
      </Title>
    ),
    normal: ({ children }) => (
      <Text mb="md" size="md">
        {children}
      </Text>
    ),
    blockquote: ({ children }) => (
      <Text
        component="blockquote"
        mb="md"
        pl="md"
        style={{ borderLeft: '3px solid var(--mantine-color-gray-4)', fontStyle: 'italic' }}
      >
        {children}
      </Text>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <List mb="md" spacing="xs">
        {children}
      </List>
    ),
    number: ({ children }) => (
      <List type="ordered" mb="md" spacing="xs">
        {children}
      </List>
    ),
  },
  listItem: {
    bullet: ({ children }) => <List.Item>{children}</List.Item>,
    number: ({ children }) => <List.Item>{children}</List.Item>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code>{children}</code>,
    underline: ({ children }) => <span style={{ textDecoration: 'underline' }}>{children}</span>,
    'strike-through': ({ children }) => <s>{children}</s>,
    link: ({ children, value }) => (
      <Anchor href={value?.href} underline="always">
        {children}
      </Anchor>
    ),
  },
};
