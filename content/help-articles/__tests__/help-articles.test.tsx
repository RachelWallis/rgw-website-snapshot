// PortableText from @portabletext/react directly (what next-sanity
// re-exports as its own `PortableText`), so this test doesn't have to pull
// in next-sanity's full barrel — createClient and, through it, the Sanity
// Studio visual-editing package tree — just to render text.
import { PortableText } from '@portabletext/react';
import { portableTextBlockComponents } from '@/lib/portableTextBlockComponents';
import { render } from '../../../test-utils';
import { combiVsSystemArticle } from '../combi-vs-system-boiler';
import { helpArticleDrafts } from '../index';
import { newBoilerCostArticle } from '../new-boiler-cost';

/**
 * Renders the RGW-017 drafted articles through the exact same block/list/
 * link components the live article page (app/help-and-advice/[slug]/page.tsx)
 * uses (see lib/portableTextBlockComponents.tsx), so "does it render
 * without breaking formatting" and "does it hit the word-count target" are
 * checked against real output, not a guess. None of the drafted bodies
 * include images, so the page's separate `image` type handler (which needs
 * a configured Sanity project) isn't exercised here — see
 * lib/portableTextComponents.tsx for that.
 */

/**
 * Word count of the rendered article prose only. MantineProvider injects a
 * <style> tag with CSS custom properties as a child of the render
 * container, and its textContent is plain text too — left in, it inflates
 * the count with theme CSS rather than the article's own words.
 */
function articleWordCount(container: HTMLElement): number {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('style, script').forEach((el) => el.remove());
  return (clone.textContent ?? '').split(/\s+/).filter(Boolean).length;
}

describe('RGW-017 drafted help articles', () => {
  it.each(helpArticleDrafts)('$title renders with no broken formatting', (article) => {
    const { container } = render(
      <PortableText value={article.body as never} components={portableTextBlockComponents} />
    );

    // At least one heading and one paragraph: a flat wall of text with no
    // structure would mean the block/style plumbing broke.
    expect(container.querySelectorAll('h2').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('p').length).toBeGreaterThan(0);

    // No block should render empty — a sign a span/child was mis-shaped.
    container.querySelectorAll('p, h2, h3').forEach((el) => {
      expect(el.textContent?.trim().length).toBeGreaterThan(0);
    });
  });

  it.each(helpArticleDrafts)('$title clears the 1,200-word expansion target', (article) => {
    const { container } = render(
      <PortableText value={article.body as never} components={portableTextBlockComponents} />
    );
    expect(articleWordCount(container)).toBeGreaterThanOrEqual(1200);
  });

  it('cross-links between the two money-query articles resolve to real routes', () => {
    const { container: newBoilerContainer } = render(
      <PortableText
        value={newBoilerCostArticle.body as never}
        components={portableTextBlockComponents}
      />
    );
    const { container: combiContainer } = render(
      <PortableText
        value={combiVsSystemArticle.body as never}
        components={portableTextBlockComponents}
      />
    );

    expect(
      Array.from(newBoilerContainer.querySelectorAll('a')).some(
        (a) => a.getAttribute('href') === '/help-and-advice/combi-vs-system-boiler'
      )
    ).toBe(true);
    expect(
      Array.from(combiContainer.querySelectorAll('a')).some(
        (a) => a.getAttribute('href') === '/help-and-advice/new-boiler-cost'
      )
    ).toBe(true);
  });

  it('every article has a non-empty excerpt within the schema limit (280 chars)', () => {
    helpArticleDrafts.forEach((article) => {
      expect(article.excerpt.length).toBeGreaterThan(0);
      expect(article.excerpt.length).toBeLessThanOrEqual(280);
    });
  });
});
