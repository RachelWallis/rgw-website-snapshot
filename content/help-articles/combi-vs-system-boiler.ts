import { business } from '@/lib/business';
import { h2, h3, p, pLink } from './blocks';

/**
 * "Combi vs system boiler" — RGW-017, drafted to expand a ~500-word
 * article to 1,200+ words for a high-intent money query. See
 * new-boiler-cost.ts for the note on placeholder pricing and the Sanity
 * publishing caveat; the same applies here.
 */
export const combiVsSystemArticle = {
  slug: 'combi-vs-system-boiler',
  title: 'Combi vs system boiler: which is right for your home?',
  excerpt:
    'How a combi and a system boiler actually differ, which suits which kind of home, and what it costs to switch between them.',
  body: [
    p(
      "Combi and system boilers heat your home the same way. The difference is entirely in how they handle hot water, and that one difference decides which one actually suits your house. Here's what each does, who it fits, and what changing from one to the other involves."
    ),
    h2('How a combi boiler works'),
    p(
      "A combi (combination) boiler heats water directly from the mains the moment you turn a tap on. There's no cylinder and no tank in the loft, everything happens inside the boiler itself, which is why combis are compact enough to fit in a kitchen cupboard. Turn the shower off and the boiler stops heating water; there's nothing sitting around waiting to be used."
    ),
    p(
      'That makes a combi the simpler system to install and live with. No airing cupboard taken up by a cylinder, no tank to top up, and no risk of running out of hot water partway through a bath because the cylinder happened to run dry.'
    ),
    h2('How a system boiler works'),
    p(
      "A system boiler heats water in advance and stores it in a cylinder, usually an unvented one under pressure from the mains rather than an old gravity tank in the loft. Because the hot water's already there, waiting, a system boiler can supply a shower and a bath, or two showers, running at the same time without either one losing pressure."
    ),
    p(
      "The trade-off is space and a bit of patience. You need somewhere for the cylinder, an airing cupboard is the usual spot, and once the stored hot water runs out, you're waiting for it to reheat rather than getting an instant refill the way a combi does."
    ),
    h2('Hot water: the real deciding factor'),
    p(
      "This is where the choice usually gets made. A combi is genuinely a great fit for a one or two-bathroom home where hot water demand rarely overlaps, someone showers, then someone else does, rather than both at once. Push past that, a family bathroom and an en-suite both wanting hot water at 7:30am, and a combi's instantaneous heating starts to show its limit: flow rate drops when demand doubles up."
    ),
    p(
      "A system boiler doesn't have that problem, because it's drawing from stored water rather than heating on the fly. If your household regularly needs hot water in two places at once, that's the strongest single reason to choose system over combi."
    ),
    h2('Space and existing pipework'),
    p(
      'If you already have a cylinder and the airing cupboard space that goes with it, staying on a system boiler is usually the path of least disruption; keeping the existing pipework and cylinder in place is more straightforward than pulling it all out for a combi. Going the other way, from an old gravity-fed system with a loft tank to either a combi or a modern unvented system boiler, involves removing the loft tank and altering more pipework either way.'
    ),
    h2('What it costs to switch'),
    p(
      "Most of RGW's like-for-like combi swaps come in between £2,400 and £3,400 fitted, depending on the model and size. Converting from a system or older conventional boiler to a combi adds around £1,000–£1,150 on top, for removing the cylinder or loft tank and altering the pipework; the online quote tool adds it automatically once you tell it what you have now."
    ),
    pLink(
      'Full guide prices for combi installs, including what pushes the price up, are in our ',
      'new boiler cost guide',
      '/help-and-advice/new-boiler-cost',
      '.'
    ),
    p(
      "Going the other way, combi to system, or installing a system boiler where there's currently no cylinder at all, costs more to install than a like-for-like combi swap, since it means adding a cylinder and the pipework to feed it, sometimes moving other pipework to make room. We fit system boilers from the same brands we install combis with, Ideal and Worcester Bosch, but because the cylinder and layout vary house to house, it's priced individually at a free survey rather than through the instant online tool."
    ),
    h2('What about a heat-only boiler? The third option, briefly'),
    p(
      "There's a third type worth a mention: heat-only (or 'regular') boilers, which need both a hot water cylinder and a cold water tank in the loft, the setup most pre-1990s British homes were built with. They're less common in new installs now, since a system boiler does the same cylinder-based job without the loft tank, but if you've got one and it's working fine, there's rarely a reason to change it just because it's the older technology. Where it usually comes up is a full central heating overhaul, at which point upgrading to a system boiler removes the loft tank and the risk of it freezing or leaking."
    ),
    h2('What a survey checks before recommending either'),
    p(
      "Mains water pressure and flow rate matter more to a combi's performance than almost anything else, so that's one of the first things checked on site, a flow test at the kitchen tap tells Rich or Kai more than any spec sheet. They'll also look at where a cylinder could go if system's the better fit, whether existing pipework can be reused, and how many outlets need hot water at once on a typical morning. It's the same free visit either way, so you're not paying twice to find out which type actually suits the house."
    ),
    h2('Running costs'),
    p(
      "Both types are efficient when they're sized correctly, modern condensing boilers from either category waste very little heat. The difference is smaller than people expect: a system boiler loses a little heat keeping the cylinder topped up between uses, but a well-insulated modern unvented cylinder loses very little of that overnight. Getting the size right for your household matters more to your gas bill than the type does."
    ),
    h2('Which one actually suits your home'),
    p(
      'Rather than a long list of scenarios, it usually comes down to two questions: how many bathrooms need hot water at the same time, and is there already a cylinder in the house?'
    ),
    h3('Combi usually wins when:'),
    p(
      "You've got one or two bathrooms that rarely need hot water simultaneously, you want the airing cupboard back for storage, or your current boiler is already a combi and there's no reason to change the setup."
    ),
    h3('System usually wins when:'),
    p(
      "You've got a bigger household or multiple bathrooms in regular use at the same time, you already have a cylinder and pipework in place, or the mains water pressure in your area isn't strong enough for a combi to perform well under demand."
    ),
    h2('Getting a proper recommendation'),
    p(
      "Boiler type is one of the few decisions worth getting a second opinion on before you commit, because switching later costs more than getting it right the first time. Our online quote tool gives you priced combi options in about 90 seconds based on your current setup and postcode. If a system boiler looks like the better fit once we've seen your home, Rich or Kai will price that at the same free survey, no extra visit, no pressure to go one way or the other."
    ),
    p(
      `Call ${business.phoneDisplay} if you'd rather talk it through first, particularly if your household's hot water habits don't fit neatly into either scenario above. That's exactly the sort of thing a five-minute conversation sorts out faster than a form.`
    ),
    h3('Can I switch from combi back to system, or the other way round, later?'),
    p(
      "Yes, either direction is possible, it's just a bigger job than a like-for-like swap because pipework and, depending on the direction, a cylinder have to change too. Most people make the switch when they're already renovating a bathroom or kitchen and the disruption's happening anyway, rather than as a standalone job."
    ),
  ],
};
