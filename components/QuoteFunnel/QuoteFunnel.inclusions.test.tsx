import { business } from '@/lib/business';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { QuoteFunnel } from './QuoteFunnel';

/**
 * RGW-049: the prices screen used to say each price "covers everything on
 * the list below" without stating what's on it per card, and the lead time
 * was a hard-coded "around 2 weeks" instead of tenant data. This asserts
 * both are now read from `business.quote` (lib/business.ts), not a
 * component constant — if the tenant data changes, this test (and the
 * rendered page) change with it rather than drifting apart.
 */
describe('QuoteFunnel results screen reads inclusions and lead time from business.ts (RGW-049)', () => {
  const questions = [
    {
      id: 1,
      field: 'bedrooms',
      text: 'How many bedrooms do you have?',
      subtext: '',
      type: 'radio',
      hint: '',
      validationKey: null,
      next_question_id: 'complete',
      options: [
        {
          id: 11,
          label: '2 bedrooms',
          next_question_id: 'complete',
          price_modifier: 0,
          icon: null,
        },
      ],
    },
  ];

  const quoteResponse = {
    packages: [
      {
        tier: 'value',
        make: 'Worcester Bosch',
        model: 'Greenstar 2000',
        description: '24kW combi boiler',
        inclusions: [],
        warrantyYears: 5,
        total: 2419,
        boilerSupply: 770,
        installation: 1249,
      },
      {
        tier: 'mid',
        make: 'Worcester Bosch',
        model: 'Greenstar 4000',
        description: '30kW combi boiler',
        inclusions: [],
        warrantyYears: 10,
        total: 2949,
        boilerSupply: 1206,
        installation: 1249,
      },
    ],
    leadId: 1,
    leadToken: 'test-token',
  };

  beforeEach(() => {
    global.fetch = jest.fn((url: string) => {
      if (url.includes('/api/questions')) {
        return Promise.resolve({ ok: true, json: async () => questions });
      }
      if (url.includes('/api/quote')) {
        return Promise.resolve({ ok: true, json: async () => quoteResponse });
      }
      return Promise.reject(new Error(`unexpected fetch: ${url}`));
    }) as unknown as typeof fetch;
  });

  it('shows the tenant inclusions line on every price card, not just the shared list', async () => {
    render(<QuoteFunnel />);

    const option = await screen.findByRole('button', { name: '2 bedrooms' });
    fireEvent.click(option);

    await waitFor(() =>
      expect(screen.getByText('Your indicative price options')).toBeInTheDocument()
    );

    // Every confirmed inclusion (lib/business.ts business.quote.inclusions)
    // also still appears in the shared "Every price includes, as standard"
    // block below the grid.
    for (const item of business.quote.inclusions) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }

    // ...and, per RGW-049, specifically on every price card too — not only
    // in that shared block.
    const cardLines = screen.getAllByTestId('card-inclusions');
    expect(cardLines).toHaveLength(quoteResponse.packages.length);
    for (const line of cardLines) {
      for (const item of business.quote.inclusions) {
        const expected = item.charAt(0).toLowerCase() + item.slice(1);
        expect(line.textContent).toEqual(expect.stringContaining(expected));
      }
    }

    // Items competitors state that RGW's own docs don't confirm (RGW-049)
    // must never be claimed.
    const inclusionsText = cardLines.map((el) => el.textContent).join(' ');
    expect(inclusionsText.toLowerCase()).not.toMatch(/co alarm|carbon monoxide/);
    expect(inclusionsText.toLowerCase()).not.toMatch(/thermostat|smart control/);
    expect(inclusionsText.toLowerCase()).not.toMatch(/workmanship guarantee/);
  });

  it('shows the lead time from business.ts, not a hard-coded string', async () => {
    render(<QuoteFunnel />);

    const option = await screen.findByRole('button', { name: '2 bedrooms' });
    fireEvent.click(option);

    await waitFor(() =>
      expect(screen.getByText('Your indicative price options')).toBeInTheDocument()
    );

    expect(
      screen.getByText(`Current lead time: ${business.quote.leadTimeLabel}`)
    ).toBeInTheDocument();
  });
});
