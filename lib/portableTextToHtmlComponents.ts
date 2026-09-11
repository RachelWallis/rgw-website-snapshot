import { escapeHTML, uriLooksSafe, type PortableTextHtmlComponents } from '@portabletext/to-html';

/**
 * HTML-string equivalents of `lib/portableTextBlockComponents.tsx`'s
 * block/marks maps, for `@portabletext/to-html` instead of
 * `@portabletext/react`. Deliberately has no dependency on
 * `sanity/client.ts` (and, through it, next-sanity's full barrel export
 * and `@sanity/image-url`, both ESM-only packages that need
 * `transpilePackages` treatment) — same reasoning as
 * `portableTextBlockComponents.tsx`'s own comment: this is what lets
 * `lib/__tests__/renderArticleBodyHtml.test.ts` exercise the actual
 * try/catch mechanism directly, in a plain Jest run, without needing a
 * configured Sanity project or extra transpile config just to import a
 * function that renders text and headings.
 *
 * `renderArticleBodyHtml.ts` uses this as the default; the `image` type
 * (which does need `urlForImage`) is composed on top of this in
 * `app/help-and-advice/[slug]/page.tsx`, mirroring exactly how
 * `portableTextComponents.tsx` composes the `image` type on top of
 * `portableTextBlockComponents.tsx` today for the React renderer.
 *
 * Visual styling matches `lib/portableTextBlockComponents.tsx`'s Mantine
 * output via `lib/articleBody.module.css`, which restyles these plain
 * tags using Mantine's own CSS custom properties rather than Mantine
 * components (this output isn't React, so there's nothing to hand a
 * Mantine component to).
 */
export const portableTextToHtmlComponents: Partial<PortableTextHtmlComponents> = {
  block: {
    h1: ({ children }) => `<h1>${children}</h1>`,
    h2: ({ children }) => `<h2>${children}</h2>`,
    h3: ({ children }) => `<h3>${children}</h3>`,
    h4: ({ children }) => `<h4>${children}</h4>`,
    h5: ({ children }) => `<h5>${children}</h5>`,
    h6: ({ children }) => `<h6>${children}</h6>`,
    normal: ({ children }) => `<p>${children}</p>`,
    blockquote: ({ children }) => `<blockquote>${children}</blockquote>`,
  },
  marks: {
    strong: ({ children }) => `<strong>${children}</strong>`,
    em: ({ children }) => `<em>${children}</em>`,
    code: ({ children }) => `<code>${children}</code>`,
    underline: ({ children }) => `<span style="text-decoration:underline">${children}</span>`,
    'strike-through': ({ children }) => `<s>${children}</s>`,
    // Overriding the library's own `link` default means its built-in
    // `uriLooksSafe`/`escapeHTML` protection (blocks `javascript:`-style
    // hrefs, escapes the value so it can't break out of the attribute) is
    // gone unless reapplied here explicitly — this custom handler exists
    // only to render a plain `<a>` without the library's default class
    // attribute, not to relax that safety.
    link: ({ children, value }) => {
      const href = typeof value?.href === 'string' ? value.href : '';
      return uriLooksSafe(href) ? `<a href="${escapeHTML(href)}">${children}</a>` : children;
    },
  },
};
