import { render, screen, userEvent, waitFor } from '../../test-utils';
import { KwCalculator } from './KwCalculator';

/**
 * QD-056: the calculator shows the band from quote-direct's GET /api/size,
 * and still answers, saying so, when the endpoint is down.
 */
describe('KwCalculator (QD-056)', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, NEXT_PUBLIC_QUICK_QUOTE_API_URL: 'https://quotedirect.test' };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = OLD_ENV;
    // @ts-expect-error test cleanup
    delete global.fetch;
  });

  it("shows the endpoint's result for the default 3 bed / 1 bath / 1 shower", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        sizeBand: '3 bed, high hot-water demand',
        bedrooms: 3,
        highDemand: true,
        kwMin: 30,
        kwMax: 34,
        type: 'combi',
        options: [
          { tier: 'value', make: 'W', model: 'Greenstar 2000', kw: 30, warrantyYears: 5 },
          { tier: 'premium', make: 'W', model: 'Greenstar 9000', kw: 34, warrantyYears: 12 },
        ],
        guidance: '',
      }),
    }) as unknown as typeof fetch;

    render(<KwCalculator />);
    await userEvent.click(screen.getByRole('button', { name: 'Show my boiler size' }));

    const result = await screen.findByTestId('kw-result');
    expect(result).toHaveAttribute('data-source', 'endpoint');
    expect(screen.getByText('3 bed, high hot-water demand')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '30 to 34 kW combi' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Premium: 34 kW Greenstar 9000/)).toBeInTheDocument();
    expect(screen.queryByTestId('kw-fallback-note')).not.toBeInTheDocument();

    const url = new URL((global.fetch as jest.Mock).mock.calls[0][0] as string);
    expect(url.href.startsWith('https://quotedirect.test/api/size?')).toBe(true);
    expect(url.searchParams.get('bedrooms')).toBe('3');
    expect(url.searchParams.get('showers')).toBe('1');
  });

  it('falls back to its own copy, with a note, when the endpoint is down', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch;

    render(<KwCalculator />);
    await userEvent.click(screen.getByRole('button', { name: 'Show my boiler size' }));

    const result = await screen.findByTestId('kw-result');
    expect(result).toHaveAttribute('data-source', 'fallback');
    expect(screen.getByTestId('kw-fallback-note')).toHaveTextContent(/our own copy/);
    expect(
      screen.getByRole('heading', { level: 2, name: '30 to 32 kW combi' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get your fitted price' })).toHaveAttribute(
      'href',
      expect.stringContaining('bedrooms=3+bedrooms')
    );
  });

  it('re-sizes when an answer changes after the result is shown', async () => {
    const fetchMock = jest.fn().mockImplementation((url: string) => {
      const beds = new URL(url).searchParams.get('bedrooms');
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          sizeBand: `${beds} bed`,
          bedrooms: Number(beds),
          highDemand: false,
          kwMin: 30,
          kwMax: 30,
          type: 'combi',
          options: [
            { tier: 'value', make: 'W', model: 'Greenstar 2000', kw: 30, warrantyYears: 5 },
          ],
          guidance: '',
        }),
      });
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<KwCalculator />);
    await userEvent.click(screen.getByRole('button', { name: 'Show my boiler size' }));
    await screen.findByText('3 bed');

    await userEvent.click(screen.getByRole('radio', { name: '4' }));
    await waitFor(() => expect(screen.getByText('4 bed')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
