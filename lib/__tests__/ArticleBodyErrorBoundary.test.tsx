import type { ComponentType } from 'react';
import { PortableText } from '@portabletext/react';
import { portableTextBlockComponents } from '@/lib/portableTextBlockComponents';
import { render } from '../../test-utils';
import { ArticleBodyErrorBoundary } from '../ArticleBodyErrorBoundary';

/**
 * RGW-028: the test environment has no Sanity credentials, so the actual
 * live document that crashes `next build` (see the RGW-028 ticket) can't
 * be fetched or reproduced here. What this suite proves instead is narrower
 * but still load-bearing: that `ArticleBodyErrorBoundary` genuinely
 * catches a render error of the *same class* the build log showed
 * ("Element type is invalid: expected a string ... but got: undefined")
 * and renders the fallback instead of letting it propagate — rather than
 * this being an untested assumption about how React error boundaries
 * behave.
 *
 * `Boom` below throws that exact error class on purpose: rendering
 * `undefined` as a JSX element type is precisely how React produces an
 * "Element type is invalid ... but got: undefined" error, so this is a
 * faithful reproduction of the error's *shape*, not a generic throw.
 */
function Boom() {
  const NotAComponent = undefined as unknown as ComponentType;
  return <NotAComponent />;
}

describe('ArticleBodyErrorBoundary (RGW-028)', () => {
  // Boom's throw is expected and handled by the boundary, but React (and
  // jsdom) still logs it to console.error as part of its own dev-mode
  // reporting; silence that noise for this suite specifically so it
  // doesn't look like an unhandled failure, while still asserting below
  // that *our* componentDidCatch call happened.
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children normally when nothing throws', () => {
    const { getByText, queryByText } = render(
      <ArticleBodyErrorBoundary slug="fine-article">
        <p>All good here</p>
      </ArticleBodyErrorBoundary>
    );

    expect(getByText('All good here')).toBeTruthy();
    expect(queryByText(/unable to display/i)).toBeNull();
  });

  it('catches a render error instead of crashing, and shows a fallback', () => {
    const { getByText } = render(
      <ArticleBodyErrorBoundary slug="boiler-losing-pressure-what-to-do">
        <Boom />
      </ArticleBodyErrorBoundary>
    );

    // The key assertion: rendering completed at all. If the boundary
    // didn't catch the error, `render` itself would have thrown and this
    // test would fail before reaching any expectation.
    expect(getByText(/unable to display this article's content/i)).toBeTruthy();
    expect(getByText(/contact us/i)).toBeTruthy();
  });

  it('logs which slug failed and why, so it is visible in build logs', () => {
    render(
      <ArticleBodyErrorBoundary slug="boiler-losing-pressure-what-to-do">
        <Boom />
      </ArticleBodyErrorBoundary>
    );

    const loggedSlugAndReason = consoleErrorSpy.mock.calls.some(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('boiler-losing-pressure-what-to-do') &&
        call[0].includes('failed to render')
    );
    expect(loggedSlugAndReason).toBe(true);
  });

  it('does not swallow a malformed Portable Text body silently: real content still renders through the boundary unaffected', () => {
    const { getByText } = render(
      <ArticleBodyErrorBoundary slug="well-formed-article">
        <PortableText
          value={
            [
              {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'Ordinary paragraph text.' }],
              },
            ] as never
          }
          components={portableTextBlockComponents}
        />
      </ArticleBodyErrorBoundary>
    );

    expect(getByText('Ordinary paragraph text.')).toBeTruthy();
  });
});
