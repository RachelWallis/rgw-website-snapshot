import { render, screen } from '../../test-utils';
import { REDIRECT_DELAY_MS, ReviewRedirect } from './ReviewRedirect';

jest.mock('../../lib/analytics', () => ({ track: jest.fn() }));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { track } = require('../../lib/analytics') as { track: jest.Mock };

describe('ReviewRedirect (/review)', () => {
  const target = 'https://search.google.com/local/writereview?placeid=abc';
  let replace: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    track.mockClear();
    replace = jest.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, replace },
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('counts the visit, then sends the visitor to Google', () => {
    render(<ReviewRedirect target={target} />);
    expect(track).toHaveBeenCalledWith('review_link_used', { target_host: 'search.google.com' });
    expect(replace).not.toHaveBeenCalled();
    jest.advanceTimersByTime(REDIRECT_DELAY_MS);
    expect(replace).toHaveBeenCalledWith(target);
  });

  it('offers a manual link in case the redirect is blocked', () => {
    render(<ReviewRedirect target={target} />);
    expect(screen.getByRole('link', { name: /open google reviews/i })).toHaveAttribute(
      'href',
      target
    );
  });
});
