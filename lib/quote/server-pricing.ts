import { createWolseleyPricing } from '@/quote-engine/pricing/wolseley';
import { rgwPriceTable } from './catalogue';

/**
 * Server-side pricing for RGW: live Wolseley trade prices when credentials
 * are configured, static fitted prices otherwise.
 * Commercials mirror the decision in DECISIONS.md #15 (RGW-005): install
 * base £1,249, markup 0%. The live values are quote-direct's
 * scripts/fixtures/rgw.json (brand.installBase / brand.markupPct); change
 * them there first, then keep this frozen route in step.
 */
export const rgwServerPricing = createWolseleyPricing({
  table: rgwPriceTable,
  installBase: 1249,
  markupPct: 0,
});
