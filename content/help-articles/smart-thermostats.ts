import { business } from '@/lib/business';
import { bullets, h2, h3, p, pLink } from './blocks';

/**
 * "Smart thermostats" — RGW-056, drafted to give the legacy
 * `/collection/samrt-thermostats` URL (Search Console: 52 impressions,
 * falling through the `/collection/:slug` catch-all to the generic
 * help-and-advice hub) somewhere real to redirect to. Same pattern as
 * combi-vs-system-boiler.ts and new-boiler-cost.ts: a draft seed, not yet
 * published. This environment has no NEXT_PUBLIC_SANITY_PROJECT_ID
 * configured, so it can't publish to the live dataset — run
 * scripts/import-help-articles.ts with a real Sanity write token to
 * publish this once one's available. Until then, the
 * `/collection/samrt-thermostats` → `/help-and-advice/smart-thermostats`
 * redirect in next.config.mjs 308s to a URL that isn't live yet.
 */
export const smartThermostatsArticle = {
  slug: 'smart-thermostats',
  title: 'Smart thermostats: Hive vs Nest vs Tado, which one and what it costs',
  excerpt:
    'How Hive, Nest and Tado actually differ, whether your boiler needs Boiler Plus compliant controls, and what fitting a smart thermostat costs.',
  body: [
    p(
      "A smart thermostat lets you control your heating from your phone instead of a dial on the wall, and on newer boilers it's not just a convenience: Boiler Plus, the building regulation that's applied to new boiler installations in England since 2018, requires certain controls to be fitted alongside the boiler itself. Here's how the three we fit most, Hive, Nest and Tado, actually differ, when a smart thermostat is a legal requirement rather than an optional extra, and what it costs to have one fitted properly."
    ),
    h2('Why a smart thermostat is sometimes not optional'),
    p(
      "Boiler Plus requires most new boiler installations to include one of a set of approved additional controls, and a smart thermostat with weather compensation or load compensation is the one most homes end up with, because it's the most useful of the qualifying options rather than the cheapest box that ticks the regulation. If you're having a new boiler fitted, this is usually already built into the price of the install, our online quote tool factors it in rather than adding it as a surprise line item afterwards."
    ),
    p(
      "If you're not replacing the boiler and just want smarter control of an existing system, none of that regulatory detail applies, it's simply a straightforward upgrade you can have fitted on its own."
    ),
    h2('How a smart thermostat actually saves money'),
    p(
      "The saving isn't magic, it comes from three things a dial-and-clock thermostat can't do: turning the heating down automatically when nobody's in rather than relying on someone remembering, adjusting the flow temperature to match how cold it actually is outside rather than firing at full whack on a mild day, and letting you fix a heating system left on by mistake from your phone instead of it running all day while you're at work. None of that needs you to remember to do anything once it's set up properly, which is where the real saving comes from over a manual thermostat."
    ),
    h2('Hive, Nest and Tado: how they actually differ'),
    p(
      'All three do the core job well, control your heating from a phone, learn or let you set a schedule, and work with hot water alongside heating. The differences that actually matter for choosing between them are smaller than the marketing suggests.'
    ),
    ...bullets([
      'Hive: the simplest to use day to day, works with the widest range of existing boilers and wiring without extra parts, and its app is the most straightforward of the three. A sensible default if you just want the features above without fuss.',
      'Nest: the best-looking hardware and the most capable learning algorithm, it genuinely adapts to your routine over a couple of weeks rather than just following a schedule you set. Slightly more particular about wiring, an existing wireless receiver sometimes needs replacing.',
      'Tado: the strongest option for zoned, room-by-room control, its optional smart radiator valves let different rooms run at different temperatures rather than the whole house following one thermostat. Worth the extra cost specifically for a larger or multi-storey home; overkill for a flat.',
    ]),
    p(
      "None of the three is meaningfully cheaper to run than the others once it's set up and left to do its job, the saving comes from having smart control at all rather than which brand supplies it. We fit whichever suits your system and how you actually live in the house, not whichever has the highest margin, and we'll say so plainly at the survey if one clearly doesn't suit your setup."
    ),
    h2("Zoned heating: when it's worth the extra step"),
    p(
      "A single thermostat controls the whole house as one zone by default, whichever room it's mounted in effectively sets the temperature everywhere. That's fine for a flat or a compact two-up two-down. In a bigger or multi-storey home, splitting heating into zones, upstairs and downstairs at minimum, sometimes room by room with Tado's valves, means you're not heating bedrooms to living-room temperature all evening or heating an empty living room overnight."
    ),
    pLink(
      "It's the same idea behind the zoned controls we fit as part of a wider ",
      'central heating installation or upgrade',
      '/what-we-do/gas-central-heating',
      ', a smart thermostat is one part of that, not the whole answer on its own.'
    ),
    h2('What fitting one involves'),
    p(
      "Most installs are a half-day job: the wall unit goes in wherever gives the most representative reading of the house, usually not right next to a radiator or in direct sun, a receiver connects to the boiler's existing wiring, and the app gets set up and explained before we leave, schedules, hot water timing, the lot, in plain English rather than left for you to figure out from the manual."
    ),
    p(
      "Older boilers with two-wire or unusual wiring occasionally need an extra part, a wiring adapter or a replacement receiver, to work with a given smart thermostat. That's exactly the kind of detail a quick phone quote can't catch, which is why we check the existing wiring at survey before confirming which thermostat will actually work cleanly with your system rather than promising one that turns into extra parts on the day."
    ),
    h2('What it costs'),
    p(
      "Fitted as a standalone upgrade to an existing boiler, a smart thermostat is one of the cheaper heating jobs we do, well under a boiler service call-out, and it's usually finished within an hour or two once we're on site. Tado's zoned valves add to that per room fitted, since each radiator valve is a separate part and a bit more time. As part of a new boiler install, the qualifying Boiler Plus control is normally already folded into the fitted price our online tool gives you, so there's no separate figure to budget for on top."
    ),
    p(
      "Exact numbers depend on which thermostat, how many valves if you're zoning, and what the existing wiring needs, which is why we quote it properly at a short visit rather than a number over the phone that might not hold once someone's actually looked at the boiler."
    ),
    h3('Do I need a smart thermostat with a new boiler?'),
    p(
      "If the installation falls under Boiler Plus, most new gas boiler installs in England since 2018, then yes, one of the approved additional controls is a legal requirement of the install, not an optional extra. A smart thermostat with weather or load compensation is the option most homes end up with because it's genuinely useful rather than just the box that satisfies the regulation."
    ),
    h3('Will a smart thermostat work with my existing boiler?'),
    p(
      'Almost always, Hive, Nest and Tado are all designed to work with the vast majority of combi, system and heat-only boilers on a two-wire connection to the existing programmer or boiler control. The main thing that occasionally needs checking is older or non-standard wiring, which is why we look at the existing setup before confirming a fit rather than assuming.'
    ),
    h3('Can I keep the old thermostat as a backup?'),
    p(
      `Usually the smart thermostat replaces the old wall unit outright rather than running alongside it, since they're both trying to control the same boiler. If that matters to you for any reason, mention it when you book and we'll talk through what's possible for your specific setup. Call ${business.phoneDisplay} if you'd rather talk it through than book online.`
    ),
    h3('Which one would you recommend?'),
    p(
      "Depends on the house. For most homes we'd suggest Hive, simplest to use and the widest boiler compatibility. For a bigger or multi-storey home where different rooms genuinely need different temperatures, Tado's zoning is worth the extra. Nest suits anyone who wants the system to learn their routine rather than set a fixed schedule. We'll give you a straight recommendation for your actual house at survey rather than a generic answer."
    ),
  ],
};
