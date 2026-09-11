import {
  bandParam,
  combiPicks,
  FALLBACK_COMBI_CATALOGUE,
  fallbackSizeBand,
  fetchSizeBand,
  isHighDemand,
  quotePrefillQuery,
  resolveSizeBand,
  type SizeApiResult,
  type SizeInput,
} from '../boiler-size';

const base: SizeInput = {
  bedrooms: 3,
  baths: 1,
  showers: 0,
  propertyType: 'Semi-Detached',
  currentBoiler: 'Combi Boiler',
};

describe('isHighDemand (mirrors quote-direct propertyFit)', () => {
  it('matches the engine rule: 2+ baths, 2+ showers, or a bath and a shower', () => {
    expect(isHighDemand(1, 0)).toBe(false);
    expect(isHighDemand(0, 1)).toBe(false);
    expect(isHighDemand(1, 1)).toBe(true);
    expect(isHighDemand(2, 0)).toBe(true);
    expect(isHighDemand(0, 2)).toBe(true);
    expect(isHighDemand(0, 0)).toBe(false);
  });
});

describe('fallbackSizeBand (the local snapshot, used only when /api/size is down)', () => {
  it('3 bed / 1 bath / 1 shower is the engine band "3 bed, high hot-water demand", 30 to 32 kW', () => {
    const band = fallbackSizeBand({ ...base, baths: 1, showers: 1 });
    expect(band.label).toBe('3 bed, high hot-water demand');
    expect(band.kwText).toBe('30 to 32 kW');
    expect(band.picks.map((p) => [p.tier, p.kw])).toEqual([
      ['value', 30],
      ['mid', 30],
      ['premium', 32],
    ]);
    expect(bandParam(band)).toBe('30-32kW');
  });

  it('3 bed / 1 bath / no separate shower is plain "3 bed" and the same kW band', () => {
    const band = fallbackSizeBand(base);
    expect(band.label).toBe('3 bed');
    expect(band.highDemand).toBe(false);
    expect(band.kwText).toBe('30 to 32 kW');
  });

  it('a small low-demand home gets the 24 kW value boiler up to the 32 kW premium', () => {
    const band = fallbackSizeBand({ ...base, bedrooms: 2, baths: 1, showers: 0 });
    expect(band.picks.map((p) => p.kw)).toEqual([24, 28, 32]);
    expect(band.kwText).toBe('24 to 32 kW');
  });

  it('a small high-demand home is never offered the 24 kW boiler', () => {
    const band = fallbackSizeBand({ ...base, bedrooms: 2, baths: 1, showers: 1 });
    expect(band.minKw).toBe(30);
    expect(band.picks.every((p) => p.kw >= 30)).toBe(true);
  });

  it('5+ beds gets only the 36 kW Greenstar 8000+, as the engine does', () => {
    const band = fallbackSizeBand({ ...base, bedrooms: 5, baths: 2, showers: 1 });
    expect(band.picks).toEqual([{ tier: 'premium', model: 'Greenstar 8000+', kw: 36 }]);
    expect(band.kwText).toBe('36 kW');
    expect(bandParam(band)).toBe('36kW');
    expect(band.suggestSystem).toBe(true);
  });

  it('clamps bedrooms to the funnel range 1 to 5', () => {
    expect(fallbackSizeBand({ ...base, bedrooms: 9 }).label).toBe('5 bed');
    expect(fallbackSizeBand({ ...base, bedrooms: 0 }).label).toBe('1 bed');
  });

  it('never offers an undersized boiler: every pick covers the bedroom count', () => {
    for (let bedrooms = 1; bedrooms <= 5; bedrooms += 1) {
      for (const highDemand of [false, true]) {
        const picks = combiPicks(bedrooms, highDemand);
        expect(picks.length).toBeGreaterThan(0);
        for (const p of picks) {
          expect(p.maxBedrooms).toBeGreaterThanOrEqual(bedrooms);
          if (highDemand) {
            expect(p.highDemandOk).toBe(true);
          }
        }
      }
    }
  });

  it('suggests a system boiler when the home already has a cylinder', () => {
    expect(fallbackSizeBand({ ...base, currentBoiler: 'System Boiler' }).suggestSystem).toBe(true);
    expect(fallbackSizeBand({ ...base, currentBoiler: 'Combi Boiler' }).suggestSystem).toBe(false);
  });

  it('every fallback band is marked as the fallback', () => {
    expect(fallbackSizeBand(base).source).toBe('fallback');
  });

  it('the catalogue mirror has one 5-bed row and it is the 36 kW premium', () => {
    const fiveBed = FALLBACK_COMBI_CATALOGUE.filter((r) => r.maxBedrooms >= 5);
    expect(fiveBed).toHaveLength(1);
    expect(fiveBed[0].kw).toBe(36);
  });
});

describe('quotePrefillQuery', () => {
  it('uses the funnel option labels so the tiles highlight', () => {
    const q = new URLSearchParams(quotePrefillQuery({ ...base, baths: 1, showers: 1 }));
    expect(q.get('bedrooms')).toBe('3 bedrooms');
    expect(q.get('baths')).toBe('1 bath');
    expect(q.get('showers')).toBe('1 shower');
    expect(q.get('propertyType')).toBe('Semi-Detached');
    expect(q.get('knowBoilerType')).toBe('Combi Boiler');
  });

  it('caps at the funnel top options (5+ bedrooms, 3+ baths)', () => {
    const q = new URLSearchParams(
      quotePrefillQuery({ ...base, bedrooms: 5, baths: 3, showers: 4 })
    );
    expect(q.get('bedrooms')).toBe('5+ bedrooms');
    expect(q.get('baths')).toBe('3+ baths');
    expect(q.get('showers')).toBe('3+ showers');
  });
});

/**
 * QD-056: the band comes from quote-direct's GET /api/size, the live
 * catalogue through the funnel's own engine. The snapshot above answers only
 * when the endpoint cannot, and the result says which it was.
 */
describe('resolveSizeBand (QD-056)', () => {
  const apiBase = 'https://quotedirect.test';
  const input: SizeInput = { ...base, baths: 1, showers: 1 };

  // A reply the snapshot could NOT produce (34 kW, a model it has never
  // heard of), so a passing test proves the endpoint's numbers are shown.
  const reply: SizeApiResult = {
    sizeBand: '3 bed, high hot-water demand',
    bedrooms: 3,
    highDemand: true,
    kwMin: 30,
    kwMax: 34,
    type: 'combi',
    options: [
      { tier: 'value', make: 'Worcester', model: 'Greenstar 2000', kw: 30, warrantyYears: 5 },
      { tier: 'premium', make: 'Worcester', model: 'Greenstar 9000', kw: 34, warrantyYears: 12 },
    ],
    guidance: 'Sized for high hot-water demand — you told us about 1 bathroom and 1 shower.',
  };

  const ok = (body: unknown) =>
    jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body });

  it('asks the endpoint with the property answers as the funnel fields, no current boiler type', async () => {
    const fetchImpl = ok(reply);
    await resolveSizeBand(input, { apiBase, fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const url = new URL(fetchImpl.mock.calls[0][0] as string);
    expect(url.origin + url.pathname).toBe(`${apiBase}/api/size`);
    expect(url.searchParams.get('tenant')).toBe('rgw');
    expect(url.searchParams.get('product')).toBe('default');
    expect(url.searchParams.get('bedrooms')).toBe('3');
    expect(url.searchParams.get('baths')).toBe('1');
    expect(url.searchParams.get('showers')).toBe('1');
    expect(url.searchParams.get('propertyType')).toBe('Semi-Detached');
    expect(url.searchParams.has('knowBoilerType')).toBe(false);
  });

  it("shows the endpoint's band, picks and kW range, marked as the endpoint's", async () => {
    const band = await resolveSizeBand(input, {
      apiBase,
      fetchImpl: ok(reply) as unknown as typeof fetch,
    });
    expect(band.source).toBe('endpoint');
    expect(band.label).toBe('3 bed, high hot-water demand');
    expect(band.highDemand).toBe(true);
    expect(band.picks).toEqual([
      { tier: 'value', model: 'Greenstar 2000', kw: 30 },
      { tier: 'premium', model: 'Greenstar 9000', kw: 34 },
    ]);
    expect(band.kwText).toBe('30 to 34 kW');
    expect(bandParam(band)).toBe('30-34kW');
    // RGW's own guidance and system-boiler suggestion still apply.
    expect(band.suggestSystem).toBe(false);
    expect(band.guidance).toMatch(/A combi is the right answer/);
  });

  it('caps 5+ bedrooms at 5 for the endpoint and keeps the system-boiler suggestion', async () => {
    const fetchImpl = ok({
      ...reply,
      sizeBand: '5 bed, high hot-water demand',
      bedrooms: 5,
      kwMin: 36,
      kwMax: 36,
      options: [
        { tier: 'premium', make: 'Worcester', model: 'Greenstar 8000+', kw: 36, warrantyYears: 10 },
      ],
    });
    const band = await resolveSizeBand(
      { ...input, bedrooms: 7, baths: 2, showers: 2 },
      { apiBase, fetchImpl: fetchImpl as unknown as typeof fetch }
    );
    const url = new URL(fetchImpl.mock.calls[0][0] as string);
    expect(url.searchParams.get('bedrooms')).toBe('5');
    expect(band.kwText).toBe('36 kW');
    expect(band.suggestSystem).toBe(true);
  });

  it('falls back to the snapshot, marked as the fallback, when the request fails', async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const band = await resolveSizeBand(input, {
      apiBase,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(band.source).toBe('fallback');
    expect(band).toEqual(fallbackSizeBand(input));
    expect(band.kwText).toBe('30 to 32 kW');
  });

  it('falls back on a non-2xx reply, a malformed body, and a reply with no options', async () => {
    const cases = [
      jest.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) }),
      jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ error: 'x' }) }),
      jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ...reply, kwMin: null, kwMax: null, options: [] }),
      }),
    ];
    for (const fetchImpl of cases) {
      const band = await resolveSizeBand(input, {
        apiBase,
        fetchImpl: fetchImpl as unknown as typeof fetch,
      });
      expect(band.source).toBe('fallback');
    }
  });

  it('falls back without a request when the quote-direct origin is not configured', async () => {
    const fetchImpl = jest.fn();
    const band = await resolveSizeBand(input, {
      apiBase: '',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(band.source).toBe('fallback');
  });

  it('fetchSizeBand itself rejects on failure so callers can choose', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 429, json: async () => ({}) });
    await expect(
      fetchSizeBand(input, { apiBase, fetchImpl: fetchImpl as unknown as typeof fetch })
    ).rejects.toThrow('429');
  });
});
