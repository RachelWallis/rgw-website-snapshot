'use client';

import { Component, type ReactNode } from 'react';
import { ArticleBodyUnavailable } from './ArticleBodyUnavailable';

type Props = {
  slug: string;
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * Isolates a subtree of an article page's render from the rest of the
 * page (title, cover image, CTA) and, more importantly, from the rest of
 * the static build.
 *
 * RGW-028, third attempt — status update: this boundary was originally
 * written as the *primary* fix for a `next build` crash on one live
 * Sanity article ("Element type is invalid: expected a string ... but got:
 * undefined", thrown from `<PortableText .../>`'s render). It was merged,
 * marked done, and then found to NOT actually fix the crash: build logs
 * after the merge showed the identical error, unchanged in shape, on a
 * subsequent production deploy.
 *
 * Root cause of why this boundary alone doesn't work, confirmed by
 * reading `@portabletext/react`'s source and Next's documented rendering
 * model (not a guess): this is a `'use client'` component, but
 * `<PortableText .../>` (no `'use client'` directive in the package
 * actually imported here) is constructed inside the `async` **Server**
 * Component page and only *passed as `children`*. Per Next's "Server
 * Components as children of Client Components" model, the Server
 * Component's render happens during the RSC/Flight pass *before* it's
 * handed to this boundary — so a throw during that pass never reaches
 * `getDerivedStateFromError`/`componentDidCatch`, which only intercept
 * errors thrown while walking *this component's own* render output.
 *
 * The primary fix is now in `page.tsx` + `lib/renderArticleBodyHtml.ts`:
 * the Portable Text body is rendered to an HTML string *synchronously*
 * inside the Server Component itself (via `@portabletext/to-html`), wrapped
 * in a plain `try/catch` — an ordinary synchronous function call, unlike
 * lazy JSX construction, so a normal `try/catch` actually can catch a
 * throw from it. See that file's comment for the full reasoning.
 *
 * This boundary is kept in place as defense-in-depth, not removed: it
 * still wraps the body region in `page.tsx` and will still catch a render
 * throw from something else in that subtree (e.g. a future component
 * added to the body area that itself renders client-side), the same
 * "one broken thing, not the whole build" isolation it was always meant
 * to provide, just no longer relied on as the fix for *this specific*
 * Portable Text crash.
 */
export class ArticleBodyErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // `next build`'s prerendering runs this on the server, so this
    // console.error is what actually surfaces in Vercel's build log —
    // which slug failed and why — instead of the whole build just dying
    // with a single unattributed stack trace.
    console.error(
      `[help-and-advice/${this.props.slug}] article body failed to render, skipping content for this page:`,
      error
    );
  }

  render() {
    if (this.state.hasError) {
      return <ArticleBodyUnavailable />;
    }
    return this.props.children;
  }
}
