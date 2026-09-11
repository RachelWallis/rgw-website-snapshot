import { render, screen } from '../../test-utils';
import { QuoteFunnel } from './QuoteFunnel';

/**
 * RGW-054: the boiler kW calculator hands its answers to /get-a-quote as a
 * query string of the funnel's own option labels. The funnel seeds them as
 * answers and highlights the matching tile; the customer still taps to
 * confirm, so branching is untouched.
 */
describe('QuoteFunnel prefill from the URL (RGW-054)', () => {
  const questions = [
    {
      id: 1,
      field: 'bedrooms',
      text: 'How many bedrooms do you have?',
      subtext: '',
      type: 'radio',
      hint: '',
      validationKey: null,
      next_question_id: null,
      options: [
        {
          id: 11,
          label: '2 bedrooms',
          next_question_id: 'complete',
          price_modifier: 0,
          icon: null,
        },
        {
          id: 12,
          label: '3 bedrooms',
          next_question_id: 'complete',
          price_modifier: 0,
          icon: null,
        },
      ],
    },
  ];

  beforeEach(() => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => questions }) as unknown as typeof fetch;
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/get-a-quote');
  });

  it('highlights the tile named in the URL and tells the customer why', async () => {
    window.history.replaceState({}, '', '/get-a-quote?bedrooms=3+bedrooms&postcode=ignored');
    render(<QuoteFunnel />);
    const three = await screen.findByRole('button', { name: '3 bedrooms' });
    expect(three).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '2 bedrooms' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    expect(screen.getByText(/earlier answer is highlighted/i)).toBeInTheDocument();
  });

  it('highlights nothing when the URL carries no matching answer', async () => {
    window.history.replaceState({}, '', '/get-a-quote?bedrooms=nine');
    render(<QuoteFunnel />);
    const three = await screen.findByRole('button', { name: '3 bedrooms' });
    expect(three).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByText(/earlier answer is highlighted/i)).not.toBeInTheDocument();
  });
});
