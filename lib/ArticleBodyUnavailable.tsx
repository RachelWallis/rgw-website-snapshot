import { Anchor, Text } from '@mantine/core';

/**
 * The plain-English fallback shown in place of an article's body when it
 * can't be rendered — shared by both:
 *  - `ArticleBodyErrorBoundary` (catches a render-time throw from any
 *    component in the body's subtree, defense-in-depth for anything other
 *    than the Portable Text body itself), and
 *  - `page.tsx`'s own try/catch around `renderArticleBodyHtml` (the
 *    primary fix for RGW-028 — see that file's comment for why a
 *    synchronous string render can be caught here where JSX-based
 *    approaches could not).
 *
 * Pulled into one place so both paths show identically-worded copy and a
 * wording change only has to happen once.
 */
export function ArticleBodyUnavailable() {
  return (
    <Text c="dimmed">
      We&apos;re unable to display this article&apos;s content right now. Please check back soon, or{' '}
      <Anchor href="/contact-us" underline="always">
        contact us
      </Anchor>{' '}
      if you need an answer sooner.
    </Text>
  );
}
