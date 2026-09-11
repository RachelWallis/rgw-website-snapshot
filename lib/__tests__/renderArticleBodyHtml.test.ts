import { renderArticleBodyHtml } from '../renderArticleBodyHtml';

/**
 * RGW-028, third attempt.
 *
 * What this suite proves: that `renderArticleBodyHtml` — a plain
 * synchronous function, called directly here exactly as `page.tsx` calls
 * it inside its Server Component body — genuinely returns `null` and logs
 * the slug when `@portabletext/to-html` throws, instead of letting the
 * throw propagate. That's the actual mechanism this fix depends on: an
 * ordinary JS try/catch around an ordinary function call.
 *
 * What this suite does NOT prove, and this ticket does not claim it does:
 * that this fixes the real crash on `boiler-losing-pressure-what-to-do`.
 * The test environment has no Sanity credentials, so that document's real
 * `body` JSON has never been seen. The malformed input below is constructed to
 * reliably throw a genuine JS exception from inside `toHTML`'s own
 * synchronous call — a `null` span inside an otherwise well-formed
 * block's `children` array, which crashes on `'_type' in null` deep
 * inside `@portabletext/toolkit` — not a copy of the real document.
 *
 * It's also a genuinely different error *class* than the previous
 * attempt's synthetic reproduction ("Element type is invalid ... but got:
 * undefined"), and deliberately so: that error is specific to
 * `@portabletext/react` handing `undefined` to React as a JSX element
 * type. `@portabletext/to-html` produces plain strings, not JSX — it
 * structurally cannot produce that exact error, which is one of the
 * reasons this approach sidesteps the previous failure mode rather than
 * risking a third variant of it. What's being proven here is the general
 * claim ("a throw during this synchronous call is caught"), demonstrated
 * with a real TypeError from a realistic malformed-document shape, not a
 * reproduction of the exact previous stack trace.
 *
 * See the RGW-028 ticket's "Verified" section for the additional,
 * higher-value proof attempted against a real `next build` static-export
 * pass (a temporary synthetic broken article injected into the actual
 * build pipeline), not just this Jest unit test — and for exactly what
 * that build-level proof does and does not establish.
 */
describe('renderArticleBodyHtml (RGW-028)', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders a well-formed article body to HTML', () => {
    const html = renderArticleBodyHtml(
      [
        {
          _type: 'block',
          _key: 'b1',
          style: 'h2',
          markDefs: [],
          children: [{ _type: 'span', _key: 's1', text: 'A heading', marks: [] }],
        },
        {
          _type: 'block',
          _key: 'b2',
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: 's2', text: 'Ordinary paragraph text.', marks: [] }],
        },
      ],
      'well-formed-article'
    );

    expect(html).not.toBeNull();
    expect(html).toContain('<h2>A heading</h2>');
    expect(html).toContain('<p>Ordinary paragraph text.</p>');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('catches a throw from a malformed body (a null span inside an otherwise well-formed block) and returns null instead of propagating', () => {
    // Tried a `null` entry at the top level of the body array first — it
    // turns out @portabletext/toolkit's nestLists() silently filters
    // those out before rendering even starts, so that shape doesn't
    // actually reach a throw (worth knowing, and noted in the ticket).
    // A `null` *inside* a block's `children` array does throw: it's
    // walked by buildMarksTree via `'_type' in child`, and `'_type' in
    // null` is a genuine TypeError, not a caught/handled case — this is a
    // real throw from deep inside the library's own synchronous call
    // (confirmed against the actual installed @portabletext/to-html, not
    // simulated), not a mock or a forced throw. A null span like this is
    // a realistic way for a Sanity document to end up malformed — e.g. a
    // deleted/dangling reference left behind by a migration script.
    const malformedBody = [
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        markDefs: [],
        children: [
          { _type: 'span', _key: 's1', text: 'Fine paragraph before the bad span.', marks: [] },
          null,
        ],
      },
    ];

    // The key assertion: this call does not throw. If the try/catch
    // didn't actually catch it, this test itself would fail with the
    // underlying TypeError instead of reaching any expectation below.
    let html: string | null = 'not yet called';
    expect(() => {
      html = renderArticleBodyHtml(malformedBody, 'boiler-losing-pressure-what-to-do');
    }).not.toThrow();

    expect(html).toBeNull();
  });

  it('logs which slug failed and why, so it is visible in build logs', () => {
    renderArticleBodyHtml(
      [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          markDefs: [],
          children: [null],
        },
      ],
      'boiler-losing-pressure-what-to-do'
    );

    const loggedSlugAndReason = consoleErrorSpy.mock.calls.some(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('boiler-losing-pressure-what-to-do') &&
        call[0].includes('failed to render to HTML')
    );
    expect(loggedSlugAndReason).toBe(true);
  });
});
