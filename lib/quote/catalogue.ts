import type { StaticTable } from '@/quote-engine';

/**
 * RGW's boiler price table, indicative fitted prices for a like-for-like
 * combi swap; the static-table provider adds job modifiers on top.
 * PLACEHOLDER PRICES: Richard to confirm before Google Ads go live.
 * productCodes are placeholders too, replace with real Wolseley codes
 * from the portal before enabling live pricing.
 */
export const rgwPriceTable: StaticTable = {
  models: [
    {
      id: 'ideal-logic-max',
      tier: 'essential',
      make: 'Ideal',
      model: 'Logic Max',
      boilerType: 'combi',
      warrantyYears: 7,
      sizes: [
        { kw: 24, price: 2195, productCode: 'IDE-LMC24' },
        { kw: 30, price: 2395, productCode: 'IDE-LMC30' },
        { kw: 35, price: 2595, productCode: 'IDE-LMC35' },
      ],
      highlights: ['Great value', 'Compact, fits in a cupboard', 'Trusted UK brand'],
    },
    {
      id: 'wb-greenstar-4000',
      tier: 'popular',
      make: 'Worcester Bosch',
      model: 'Greenstar 4000',
      boilerType: 'combi',
      warrantyYears: 10,
      sizes: [
        { kw: 25, price: 2595, productCode: 'WOR-G4025' },
        { kw: 30, price: 2795, productCode: 'WOR-G4030' },
        { kw: 35, price: 2995, productCode: 'WOR-G4035' },
      ],
      highlights: ['Which? Best Buy brand', '10-year warranty', 'Quiet running'],
    },
    {
      id: 'wb-greenstar-8000',
      tier: 'premium',
      make: 'Worcester Bosch',
      model: 'Greenstar 8000 Life',
      boilerType: 'combi',
      warrantyYears: 12,
      sizes: [
        { kw: 30, price: 3295, productCode: 'WOR-G8030' },
        { kw: 35, price: 3495, productCode: 'WOR-G8035' },
        { kw: 40, price: 3695, productCode: 'WOR-G8040' },
      ],
      highlights: ['Top of the range', '12-year warranty', 'Best for busy households'],
      imageSrc: '/images/boilers/WorcesterBosch8000.jpg',
    },
  ],
  modifiers: {
    conversionFee: {
      combi: 0,
      system: 650,
      conventional: 850,
      none: 950,
    },
    moveLocationFee: 450,
    lpgFee: 150,
  },
};
