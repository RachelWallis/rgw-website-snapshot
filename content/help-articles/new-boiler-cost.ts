import { business } from '@/lib/business';
import { bullets, h2, h3, p, pLink } from './blocks';

/**
 * "New boiler cost" — RGW-017, drafted to expand a ~500-word article to
 * 1,200+ words for a high-intent money query. Prices are RGW's own guide
 * figures from lib/quote/catalogue.ts (rgwPriceTable), the same numbers
 * already live in the Boiler Services FAQ (lib/services.ts). That table is
 * marked PLACEHOLDER pending Richard's confirmation before Google Ads go
 * live — reusing it here keeps every page consistent, but the numbers
 * still need the same sign-off before this goes live (see RGW-003 and the
 * ticket's "Verified" section for exactly what that means for this draft).
 *
 * NOTE: this file is a draft seed, not yet published. There is no local
 * copy of whatever ~500-word version currently lives in the Sanity
 * dataset — this environment has no NEXT_PUBLIC_SANITY_PROJECT_ID
 * configured, so it can't be fetched. Use scripts/import-help-articles.mjs
 * to publish this once a Sanity write token is available.
 */
export const newBoilerCostArticle = {
  slug: 'new-boiler-cost',
  title: 'How much does a new boiler cost?',
  excerpt:
    'Real guide prices for a new boiler installed in South Hampshire: what a like-for-like swap costs, what pushes the price up, and how to get an exact figure.',
  body: [
    p(
      `A new boiler fitted in South Hampshire typically comes in between £2,400 and £3,400 for a straightforward like-for-like combi swap, more if the job needs extra work. The exact number depends on four things: the boiler you choose, what's coming out, how much extra work the install needs, and where you live. Here's how each one moves the price, with real guide figures rather than a vague "prices from £X" headline.`
    ),
    h2('What a like-for-like combi swap costs'),
    p(
      "When your existing boiler is already a combi and it's staying in the same spot, you're paying for the unit and the labour to swap it. That's the simplest job we do, and it's what most of our online quotes come back as."
    ),
    ...bullets([
      'Worcester Bosch Greenstar 4000, 25kW or 30kW: the boiler most of our online quotes come back with, around £2,500–£3,000 fitted, 10-year warranty',
      'Worcester Bosch Greenstar Compact CDi, 28kW to 36kW, for homes with two or more bathrooms or showers: around £2,800–£3,200 fitted, 5-year warranty',
      'Worcester Bosch Greenstar 8000+, 32kW or 36kW: around £2,850–£3,400 fitted, 10-year warranty',
    ]),
    p(
      "Those are guide prices for the boiler and standard fitting, VAT included. Rich or Kai confirm the exact figure at a free survey before anything's booked in, so what you're quoted online is a solid starting point, not the final word."
    ),
    h2('What pushes the price up'),
    p(
      "A like-for-like swap is the cheapest job because nothing about the pipework or the boiler's position changes. Move away from that and a few things add to the price:"
    ),
    ...bullets([
      'Switching from a system or older conventional (gravity-fed) boiler to a combi: around £1,000–£1,150, for removing the cylinder or loft tank and altering the pipework',
      'Moving the boiler: around £370–£420 to a different spot in the same room, £580–£660 to another room, £710–£820 into a garage or loft, plus a new flue kit at around £90–£105',
      'A boiler above the ground floor of a flat, where the flue needs high-level access: around £290–£330',
      'A flue that goes out through the roof rather than the wall: around £190–£220',
      'Removing an old hot-water tank: around £260–£300',
      'A powerflush of the radiators while the system is drained down anyway: around £550–£630',
    ]),
    p(
      "These are add-ons on top of the boiler price above, not separate jobs. Like the boiler prices themselves, they're guide figures that get confirmed at survey, once Rich or Kai have actually seen the pipework."
    ),
    h2('What size boiler your home needs'),
    p(
      "The kW rating decides how much hot water the boiler can push out at once, not how big your house is. A one-bathroom home is usually fine on the smallest size in each range. Add a second or third bathroom, or a household that showers back to back most mornings, and the next size up avoids someone getting a trickle while the shower's already running elsewhere."
    ),
    p(
      "Our online quote tool asks how many bathrooms you have and picks a sensible size automatically, but it's worth flagging anything unusual, like a power shower or a bath that fills slowly, when Rich or Kai come round. That's exactly the kind of detail a phone quote or a size chart online can't account for."
    ),
    h2('Combi, system or heat-only: the type changes the price too'),
    p(
      "Most of the figures above are for combi boilers, because that's what most South Hampshire homes have and what our instant online tool currently prices. System and heat-only boilers usually cost more to install if a hot water cylinder is involved, since there's more pipework and, on an unvented cylinder, a bit more certification. They tend to suit bigger households better, particularly where two bathrooms need hot water at the same time."
    ),
    pLink(
      "If you're not sure which type actually fits your home, ",
      "we've written a full combi vs system comparison",
      '/help-and-advice/combi-vs-system-boiler',
      ' that walks through the trade-offs properly.'
    ),
    p(
      "Because system and heat-only jobs vary a lot house to house (cylinder size, where it goes, what's already there), our online tool doesn't price them automatically the way it does combi swaps. Rich or Kai will price yours at the same free survey, so it's still one visit and one fixed number, just not an instant online figure."
    ),
    h2("What's actually involved in a boiler installation"),
    p(
      "A straightforward swap is usually a one-day job. The old boiler comes out and gets disposed of, the new one goes in, the flue is run to the outside wall, and the whole system is pressure-tested before it's signed off. You get a benchmark logbook with the installation on record, which matters for keeping the manufacturer's warranty valid down the line."
    ),
    p(
      "Anything beyond a like-for-like swap, moving the boiler, converting from a different type, adding a cylinder, adds time on top of that. It's still normally finished in a day, occasionally two if there's a lot of pipework to re-route."
    ),
    h2('Installed price vs running costs'),
    p(
      "The cheapest boiler on the day isn't always the cheapest one over ten years. A longer warranty (up to 12 years on the Worcester Bosch 8000 range we fit) means fewer years of paying for parts and call-outs once the manufacturer cover runs out, and modern condensing boilers across all three ranges we install are efficient enough that the gap in running costs between them is small. The bigger factor is usually getting the size right for your home, an oversized boiler cycles on and off more than it needs to, which wastes gas rather than saving it."
    ),
    h2('Why we mostly fit Ideal and Worcester Bosch'),
    p(
      "We install boilers from other brands on request, but Worcester Bosch makes up most of what we fit, because their reliability and warranty support hold up over the years we're actually accountable for the job. Worcester Bosch is a Which? Best Buy brand and backs the Greenstar 4000 and 8000+ with a 10-year guarantee when we register the install; the Compact CDi carries 5 years."
    ),
    p(
      "None of that is us pushing a particular boiler. If your old one is a different brand and still under warranty, or you've got a preference, say so at the survey and we'll work with it where we can."
    ),
    h3('When a repair costs less than a replacement'),
    p(
      `If your existing boiler is losing pressure, throwing an error code or just making a racket, it's often cheaper to fix than replace. Our minimum call-out for boiler repairs is £100 (incl VAT) for the first hour, £75 after, and we'll always tell you honestly when a repair no longer makes sense rather than talk you into a new boiler you don't need yet.`
    ),
    pLink(
      'Full detail on repairs and pricing is on our ',
      'boiler services page',
      '/what-we-do/boiler-services',
      '.'
    ),
    h2('Getting an exact price for your home'),
    p(
      "Guide prices are useful for budgeting, but the only way to get a number that actually holds is to have someone look at your setup. Our online tool gets you a choice of priced options in about 90 seconds based on your current boiler, bathrooms and postcode. From there, it's a free survey to confirm the details and lock the price in, not a hard sell and not an online booking calendar, just a call to arrange a time that works."
    ),
    h3('How accurate is the online quote?'),
    p(
      "Close, for most homes. It's built from the same guide prices in this article, plus the modifiers for conversions, moving the boiler and LPG. The survey exists to catch anything the questions can't, an awkward flue run, asbestos-era pipework, that sort of thing, and to confirm the final number before you commit to anything."
    ),
    h3('Do I need to be in when the survey happens?'),
    p(
      `Ideally yes, it's a short visit and it means Rich or Kai can see the actual boiler, the flue route and where pipework runs, rather than guessing from photos. Call ${business.phoneDisplay} if a time needs to be flexible around work, we'll fit around you where we can.`
    ),
    h3('Do the prices above include VAT?'),
    p(
      'Yes. Every fitted price quoted, online or at survey, is inc VAT, not a trade price with tax added on top afterwards. What you see is what gets invoiced, and the survey confirms that figure before any work is booked in.'
    ),
  ],
};
