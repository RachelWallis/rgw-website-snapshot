import { toHTML, type PortableTextHtmlComponents } from '@portabletext/to-html';
import { portableTextToHtmlComponents } from './portableTextToHtmlComponents';

/**
 * RGW-028, third attempt — this is the actual fix.
 *
 * Two previous attempts at the same production bug (`next build` crashing
 * on one live Sanity article's Portable Text body, taking all 76+ other
 * static routes down with it) both tried to catch the throw from inside
 * React's own render pass:
 *
 *  1. Filling out `portableTextBlockComponents.tsx`'s block/marks maps
 *     (kept, harmless, but the ticket's own tracing of
 *     `@portabletext/react`'s merge logic already showed this wasn't the
 *     actual cause — it falls back gracefully for unhandled style/mark
 *     keys instead of throwing).
 *  2. `ArticleBodyErrorBoundary`, a React Error Boundary class component.
 *     Verified — by reading `@portabletext/react`'s source (no
 *     `'use client'` directive) and Next's documented "Server Components
 *     as children of Client Components" rendering model, not by
 *     guessing — that this can't work here: the Server Component builds
 *     `<PortableText .../>` and hands it to the client boundary as an
 *     already-rendered child; the boundary's `componentDidCatch` only
 *     sees throws from its *own* render, not from the Server Component
 *     tree that produced what it was handed.
 *
 * Both attempts failed for the same underlying reason: they relied on
 * JSX construction (`<PortableText value={...} />`), which doesn't
 * actually *call* anything at the point it's written — it builds an
 * element description that some later, separate pass evaluates. A
 * try/catch wrapped around JSX construction closes before that pass runs
 * and never sees what it throws.
 *
 * This function sidesteps that entirely: `toHTML(...)` is an ordinary
 * synchronous function that returns a string, called directly inside the
 * Server Component's own execution — no separate render pass, no
 * component tree for a boundary to sit outside of. A plain `try/catch`
 * around an ordinary function call **does** see what it throws. That's
 * the whole mechanism this fix relies on, and it's a JavaScript guarantee
 * rather than something specific to Next or React — see
 * `lib/__tests__/renderArticleBodyHtml.test.ts` for a synthetic proof of
 * exactly that, and this ticket's "Verified" section for how far that
 * proof does and doesn't go without real Sanity access.
 *
 * Takes `components` as a parameter (defaulting to the sanity-free
 * `portableTextToHtmlComponents`) rather than importing the `image` type
 * handler itself, so this module — and its unit test — have no
 * dependency on `sanity/client.ts`. `page.tsx` composes the `image`
 * handler on top before calling this, the same layering
 * `portableTextComponents.tsx` already used for the React renderer.
 */
export function renderArticleBodyHtml(
  body: unknown,
  slug: string,
  components: Partial<PortableTextHtmlComponents> = portableTextToHtmlComponents
): string | null {
  try {
    return toHTML(body as never, { components });
  } catch (error) {
    // Same visibility goal as ArticleBodyErrorBoundary's log: `next
    // build`'s prerendering runs this on the server, so this is what
    // actually surfaces in Vercel's build log with the failing slug
    // attached, instead of the whole build dying on one unattributed
    // stack trace.
    console.error(
      `[help-and-advice/${slug}] article body failed to render to HTML, falling back:`,
      error
    );
    return null;
  }
}
