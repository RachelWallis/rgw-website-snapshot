import type { Faq } from '@/lib/schema';

/**
 * Ten town pages replacing the 43 near-identical `/[landing]` pages
 * (RGW-026). Unlike that template, every paragraph here is genuinely
 * town-specific — housing stock, local development history, distinct
 * FAQs — not a shared paragraph with the town name substituted in.
 *
 * Source: a site review (28 August 2026) that wrote this copy directly
 * (RGW-026, tracked in Trello). `richToSupply` fields are facts only
 * Richard has — never fabricate a replacement, leave the gap or omit the
 * section.
 */

export type TownPage = {
  slug: string;
  name: string;
  tierLabel: 'Home turf' | 'Daily coverage' | 'Regular coverage';
  postcodes: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  costs: string;
  faqs: Faq[];
  richToSupply?: string;
  /** Old `/[landing]` slugs this page now covers, for the redirect map in
      next.config.mjs — documentation here, not consumed programmatically
      (next.config.mjs can't import this TS module). Keep the two in sync
      by hand if this list changes. */
  oldSlugs: string[];
};

export const townPages: TownPage[] = [
  {
    slug: 'eastleigh',
    name: 'Eastleigh',
    tierLabel: 'Daily coverage',
    postcodes: 'SO50',
    title: 'Boiler installation & plumbing in Eastleigh',
    metaDescription:
      'Gas Safe engineers two miles away in Bishopstoke. New boilers priced online in 90 seconds. Servicing, repairs and 24-hour emergency cover across SO50.',
    h1: 'Heating & plumbing in Eastleigh',
    intro:
      "We're based in Bishopstoke, about two miles from Eastleigh town centre. That's not a marketing line — it means if your heating goes down on a Tuesday morning we can usually be with you the same day, and there's no travel charge on any job in SO50.",
    sections: [
      {
        heading: "Boilers in Eastleigh's older housing",
        paragraphs: [
          'Eastleigh grew around the railway works — the carriage and wagon works arrived in 1891, the locomotive works in 1909 — and a good chunk of the town is still the terraced and semi-detached housing built for the people who worked there, with interwar and post-war estates filled in around it.',
          'Those houses throw up the same handful of problems again and again. Old back-boiler positions that leave you choosing between an ugly flue run and a longer pipe route. Condensate that has to reach a drain at the front because there’s no side access. Microbore pipework from a 1970s or 80s upgrade that a modern boiler will happily expose as full of sludge. Chimney breasts closed up without a vent.',
          "None of it is exotic. It's just the sort of thing you want spotted at the survey rather than discovered on installation day, which is why we come and look before anyone pays anything.",
        ],
      },
      {
        heading: 'Emergencies and repairs',
        paragraphs: [
          "No heating, no hot water, or water you can't stop — call rather than fill in a form. We hold 24-hour emergency cover and from Bishopstoke we can be in most of Eastleigh quickly. If it's something you can safely sort yourself, we'll tell you that on the phone instead of charging you to hear it.",
        ],
      },
    ],
    costs:
      "A like-for-like combi swap in a typical Eastleigh terrace or semi mostly comes in between £2,400 and £3,400 fitted. Our online tool gives an indicative fitted price in about 90 seconds; a free survey then confirms it and locks it in. An annual service is from £100. If something has failed, it's £100 for the first hour and £75 an hour after, with no separate call-out fee.",
    faqs: [
      {
        question: 'Can you fit a combi in a terraced house with no side access?',
        answer:
          "Almost always, yes. The flue and condensate routing takes more thought and occasionally the boiler ends up somewhere you weren't expecting — a bedroom cupboard rather than the kitchen. We'll show you the options at the survey.",
      },
      {
        question: 'Do you need permission to run a flue near a boundary?',
        answer:
          "There are minimum distances from boundaries, windows and openings we have to meet under gas regulations. On tight terraced plots that's the thing most likely to change the plan, so it's the first thing we check.",
      },
      {
        question: 'My radiators are cold at the bottom. Is that a new boiler job?',
        answer:
          'Usually not. That’s sludge, and a powerflush from £600 will often buy an old system several more years. Fitting a new boiler onto a dirty system without cleaning it is the fastest way to void the warranty.',
      },
      {
        question: 'How quickly can you get to me?',
        answer:
          'Same day for urgent jobs in Eastleigh in most cases, next day for everything else. Installations are typically within a week of the survey, sooner if you’ve no heat or hot water at all.',
      },
    ],
    richToSupply:
      'Two or three recent Eastleigh jobs, one line each — boiler fitted, property type, how long it took. No addresses needed.',
    oldSlugs: [
      'new-boiler-eastleigh',
      'boiler-service-eastleigh',
      'emergency-plumber-eastleigh',
      'new-boiler-allbrook',
    ],
  },
  {
    slug: 'bishopstoke',
    name: 'Bishopstoke',
    tierLabel: 'Home turf',
    postcodes: 'SO50',
    title: 'Your local Bishopstoke plumber & boiler fitter',
    metaDescription:
      'We live and work in Bishopstoke. Gas Safe registered since 2009, new boilers priced online in 90 seconds, servicing from £100, and someone who can be round in minutes when it matters.',
    h1: 'Heating & plumbing in Bishopstoke',
    intro:
      "This is home. RGW has been run out of Bishopstoke since 2009, which means most of the work we do here came from someone down the road recommending us — and that when a Bishopstoke customer calls with a leak, we're minutes away rather than an hour.",
    sections: [
      {
        heading: 'Two Bishopstokes, two sorts of heating problem',
        paragraphs: [
          'The village splits fairly neatly. Old Bishopstoke, running down toward the Itchen, still has plenty of 18th and 19th century property — solid walls, awkward pipe runs, high ceilings and rooms that take real output to heat properly. Undersizing a boiler here is a genuine risk, and so is fitting a combi to a house with three bathrooms and a bad mains flow rate.',
          "New Bishopstoke, and the estates east of the village, is a different job entirely: better insulated, more predictable, often a system boiler and cylinder in an airing cupboard that's now fifteen or twenty years old and coming to the end of its life. Straightforward work, usually done in a day.",
          'We quote for the house in front of us rather than a category, which is easier to do when you already know the street.',
        ],
      },
      {
        heading: 'The bit that matters in a village',
        paragraphs: [
          "The person who prices your job is the person who turns up to do it. No call centre, no subcontracted fitter, and no incentive for us to sell you something you don't need — because we'll still be living here next year, and so will you.",
        ],
      },
    ],
    costs:
      'Combi swaps mostly come in between £2,400 and £3,400 fitted, and you can get an indicative price online in about 90 seconds before speaking to anyone. Annual services are from £100. Repairs are £100 for the first hour, £75 after, with nothing added for getting here.',
    faqs: [
      {
        question: "We've got an old cylinder in the airing cupboard. Should we go combi?",
        answer:
          'It depends on how many bathrooms you have and what your incoming mains flow rate is. We measure it at the survey. If the flow is poor, a combi will disappoint you every morning and we’ll say so.',
      },
      {
        question: 'Do you work on period properties in Old Bishopstoke?',
        answer:
          "Regularly. Older houses need more care over pipe routing and flue positioning, and often more radiator output than a modern equivalent. It's a longer survey, not a harder job.",
      },
      {
        question: 'Can you come out today?',
        answer: "For Bishopstoke, usually yes — we're here. Call rather than email if it's urgent.",
      },
    ],
    richToSupply:
      'How many Bishopstoke households you’ve worked for. If it’s a number like "over 200 homes in the village", say it — it’s the most persuasive sentence available and nobody else can claim it.',
    oldSlugs: [
      'new-boiler-bishopstoke',
      'boiler-service-bishopstoke',
      'emergency-plumber-bishopstoke',
    ],
  },
  {
    slug: 'chandlers-ford',
    name: "Chandler's Ford",
    tierLabel: 'Daily coverage',
    postcodes: 'SO53',
    title: "Boiler installation in Chandler's Ford & Hiltingbury",
    metaDescription:
      'Gas Safe engineers covering SO53 daily from nearby Bishopstoke. System boilers, unvented cylinders and combi swaps priced online in 90 seconds.',
    h1: "Heating & plumbing in Chandler's Ford",
    intro:
      "Chandler's Ford and Hiltingbury are inside our daily patch — around fifteen minutes from the workshop in Bishopstoke, no travel surcharge, and easy to fit into the same week.",
    sections: [
      {
        heading: "Big houses, hot water, and why a combi often isn't the answer",
        paragraphs: [
          "Chandler's Ford was largely built out through the twentieth century in waves: the 1920s around Hiltingbury and King's Court, the Hursley Road development, then Scantabout, Peverells Road and Oakmount, and most recently Valley Park and Millers Dale. It's a residential area of detached and larger semi-detached houses rather than terraces, and that changes the heating job considerably.",
          "Two bathrooms and an en-suite is common here, and that's the point at which a combi starts to struggle — two showers running at once and everybody's disappointed. Much of the time the right answer in SO53 is a system boiler with a properly sized unvented cylinder, which costs more up front and works far better for the next fifteen years. We'll tell you which camp your house falls into before you spend anything.",
          'The older 1930s to 1960s stock has its own signature: microbore pipework, radiators that have never been balanced, and sludge that has had sixty years to settle. If your upstairs is fine and your downstairs never quite gets there, that’s usually the cause.',
        ],
      },
    ],
    costs:
      'A straightforward combi swap mostly comes in between £2,400 and £3,400 fitted. A system boiler and unvented cylinder is a bigger job and we’ll price it properly at the survey rather than guess. Servicing from £100, repairs at £100 for the first hour and £75 after.',
    faqs: [
      {
        question: "We've got two bathrooms. Combi or system?",
        answer:
          'If both get used at the same time, system with a cylinder, nearly every time. A combi delivers hot water at a fixed rate — split that between two showers and neither is any good.',
      },
      {
        question: 'Are you certified for unvented cylinders?',
        answer:
          'Unvented hot water work requires its own qualification on top of Gas Safe registration. Ask us for it, and ask anyone else quoting you for it too.',
      },
      {
        question: 'Why is our downstairs always colder than upstairs?',
        answer:
          'Almost always sludge or an unbalanced system rather than a failing boiler. A powerflush from £600, plus proper balancing, fixes it more often than a new boiler would.',
      },
      {
        question: 'Do you cover Hiltingbury and Valley Park?',
        answer: 'Yes — the whole of SO53 is in our daily coverage area, same as Eastleigh.',
      },
    ],
    richToSupply:
      'Your unvented (G3) qualification details, so the FAQ above can name it rather than gesture at it.',
    oldSlugs: [
      'new-boiler-chandlers-ford',
      'boiler-service-chandlers-ford',
      'emergency-plumber-chandlers-ford',
      'new-boiler-hiltingbury',
    ],
  },
  {
    slug: 'fair-oak',
    name: 'Fair Oak',
    tierLabel: 'Daily coverage',
    postcodes: 'SO50',
    title: 'New boiler installation in Fair Oak',
    metaDescription:
      'Fair Oak and Horton Heath boiler installation from Rich and Kai, Gas Safe engineers nearby. Priced online in 90 seconds, confirmed at a free survey.',
    h1: 'New boiler installation in Fair Oak & Horton Heath',
    intro:
      'Fair Oak and Horton Heath are a few minutes up the road from us in Bishopstoke, both inside SO50 and both on our daily round. Rich and Kai, our Gas Safe registered engineers, are rated 5.0 stars from 13 Google reviews. Same-day for urgent work here in most cases, and no travel charge either way.',
    sections: [
      {
        heading: 'The boilers coming due here right now',
        paragraphs: [
          'Fair Oak is a village that grew outward through estate building rather than one that was ever built all at once, so you get a genuine mix — older village property, 1970s and 80s family housing, and a lot of homes put up from the 1990s onward as the parish expanded.',
          'That last group is where most of our work here comes from at the moment. A boiler installed when those estates were built is now somewhere between fifteen and thirty years old. It probably still runs. It is also probably costing you a meaningful amount every winter — a boiler over ten or twelve years old can be fifteen to twenty-five per cent less efficient than a current one — and it’s increasingly likely to fail at the least convenient moment.',
          'Replacing before it dies is cheaper and calmer than replacing on the coldest night of the year. It also means you get to choose the boiler rather than take whatever can be got hold of by tomorrow.',
        ],
      },
    ],
    costs:
      'A like-for-like combi swap mostly comes in between £2,400 and £3,400 fitted, with an indicative price online in about 90 seconds. Services from £100. Repairs £100 for the first hour, £75 after. Landlord gas safety certificates for the rental properties around the village — give us a ring for a price.',
    faqs: [
      {
        question: 'My boiler still works. Why replace it now?',
        answer:
          "Because you're in charge of the timing. Replace it in September and you choose the boiler, the date and the price. Replace it in January when it dies and you take whatever's available.",
      },
      {
        question: 'How long does an installation take?',
        answer:
          'A straight swap is usually a single day. Moving the boiler to a different room, or changing system type, is normally two.',
      },
      {
        question: 'Do you cover Horton Heath?',
        answer:
          'Yes — Horton Heath, Fair Oak and the surrounding lanes are all on the daily round.',
      },
    ],
    richToSupply:
      'A landlord certificate price. Every other service on the site has a number against it and this one doesn’t — it’s the one people ring around for.',
    oldSlugs: ['new-boiler-fair-oak', 'new-boiler-horton-heath'],
  },
  {
    slug: 'hedge-end',
    name: 'Hedge End',
    tierLabel: 'Regular coverage',
    postcodes: 'SO30',
    title: 'Boiler installation, repairs and servicing in Hedge End',
    metaDescription:
      'Boiler installation, repairs and servicing in Hedge End from Rich and Kai, Gas Safe engineers. Priced online in 90 seconds, no travel surcharge.',
    h1: 'Boiler installation, repairs and servicing in Hedge End',
    intro:
      'Hedge End is a regular run for us from Bishopstoke, no travel surcharge and easily booked into the same week. Rich and Kai are Gas Safe registered, rated 5.0 stars from 13 Google reviews. We handle boiler installation, repairs and servicing across Hedge End, Grange Park and Boorley Green.',
    sections: [
      {
        heading: 'A town of estates that all need boilers at once',
        paragraphs: [
          'Hedge End was a village of around a thousand people in the 1950s. The M27 changed that: rapid expansion from the 1980s onward, a railway station in the early nineties, and by 2001 a population approaching eighteen thousand — with Grange Park and the estates north and east of the old centre built out largely from the nineties.',
          'What that means, practically, is a town where an enormous number of homes have a boiler of roughly the same age, installed by whoever the developer used, reaching the end of its life at roughly the same time. If your neighbours have been replacing theirs, yours is on the same clock.',
          'Modern estate housing is generally good to work on: sensible pipe runs, decent insulation, boilers in garages, utility rooms or kitchen cupboards, often on vertical flues through a flat roof or a boxed run. The one thing worth checking early is whether the original installer left enough room to fit a current boiler in the same cupboard — the dimensions have changed.',
        ],
      },
    ],
    costs:
      'Combi swaps mostly £2,400–£3,400 fitted, with an indicative price online in about 90 seconds. Annual servicing from £100. Repairs at £100 for the first hour and £75 an hour afterwards. Powerflushing from £600, which on a system of this age is often the better value job.',
    faqs: [
      {
        question: 'Can you put the new boiler in the same cupboard?',
        answer:
          'Usually, but not always — cupboard clearances and flue access matter more than the boiler’s own dimensions. One of the things we measure at the survey rather than assume.',
      },
      {
        question: 'Our boiler keeps losing pressure. Is that terminal?',
        answer:
          'Often not. It’s usually a leak somewhere on the system, a failed expansion vessel or a passing pressure relief valve. All three are repairs, not replacements.',
      },
      {
        question: 'Do you cover Boorley Green and Grange Park?',
        answer: 'Yes, both — along with Botley just up the road.',
      },
      {
        question: 'Is there a charge for coming out to Hedge End?',
        answer:
          'No. It’s within our regular coverage area, so there’s no travel surcharge on quotes or on work.',
      },
    ],
    oldSlugs: [
      'new-boiler-hedge-end',
      'boiler-service-hedge-end',
      'emergency-plumber-hedge-end',
      'new-boiler-boorley-green',
    ],
  },
  {
    slug: 'winchester',
    name: 'Winchester',
    tierLabel: 'Regular coverage',
    postcodes: 'SO22 / SO23',
    title: 'Boiler installation in Winchester',
    metaDescription:
      'Gas Safe engineers working across Winchester since 2009, including period and conservation-area homes. New boilers priced online in 90 seconds. No travel surcharge.',
    h1: 'Heating & plumbing in Winchester',
    intro:
      'We’ve been installing boilers around Winchester and the SO22 and SO23 postcodes since 2009. It’s inside our regular coverage area, easily booked in, and there’s no travel surcharge.',
    sections: [
      {
        heading: 'Old houses, listed buildings and where the flue can go',
        paragraphs: [
          'Winchester is a harder place to fit a boiler than almost anywhere else we work, and it’s worth saying so plainly. Large parts of the city sit inside conservation areas and a great many properties are listed, which puts real constraints on where a flue can terminate and what external pipework is acceptable on a visible elevation. Get that wrong and you’ve got a problem costing a great deal more than the boiler.',
          'Beyond the consent question, the housing itself is demanding. Solid walls, high ceilings, big single-glazed sashes and long pipe runs mean a heat loss calculation matters here in a way it doesn’t on a modern estate — a boiler sized by rule of thumb will either be underpowered or expensively oversized. Larger period houses with several bathrooms usually want a system boiler and a properly specified unvented cylinder rather than a combi.',
          'We survey these properly and take longer over it. If the job needs consent before we can proceed, we’d rather tell you at the survey than halfway through the install.',
        ],
      },
    ],
    costs:
      'Straightforward combi swaps mostly come in between £2,400 and £3,400 fitted and the online tool gives an indicative figure in about 90 seconds. Period and larger properties vary far more than that, so treat the online price as a starting point and let the free survey do the real work. Servicing from £100, repairs £100 for the first hour and £75 after.',
    faqs: [
      {
        question: 'Our house is listed. Can you still fit a new boiler?',
        answer:
          'Yes, but flue position and external pipework may need consent from the local authority, and that’s determined by the property rather than by us. We’ll flag what’s likely to need permission at the survey so nothing stalls mid-job.',
      },
      {
        question: 'Why is the online price less reliable for a Winchester house?',
        answer:
          'Because the tool prices a standard replacement. A four-storey Victorian house with two bathrooms and a cellar isn’t standard. The survey is where the real number comes from — and it’s free either way.',
      },
      {
        question: 'Can you improve how a period house heats without replacing everything?',
        answer:
          'Often. Correct radiator sizing, balancing, a powerflush from £600 and decent controls will transform a lot of older systems. We’d rather sell you that than a boiler you didn’t need.',
      },
      {
        question: 'Do you charge extra to come to Winchester?',
        answer:
          'No. Winchester is inside our regular coverage area — no travel surcharge on the survey or the work.',
      },
    ],
    richToSupply:
      'Confirm you’re happy taking on listed and conservation-area work, and whether you’ve done any. If yes, this page becomes a genuine differentiator; if no, the section should be softened.',
    oldSlugs: [
      'new-boiler-winchester',
      'boiler-service-winchester',
      'emergency-plumber-winchester',
      'new-boiler-compton',
      'new-boiler-twyford',
      'new-boiler-otterbourne',
      'new-boiler-hockley',
      'new-boiler-owslebury',
      'new-boiler-colden-common',
      'new-boiler-alresford',
    ],
  },
  {
    slug: 'southampton',
    name: 'Southampton',
    tierLabel: 'Regular coverage',
    postcodes: 'SO14–SO19',
    title: 'Boiler servicing, repairs and installation in Southampton',
    metaDescription:
      'Boiler servicing, repairs and installation in Southampton from Rich and Kai, Gas Safe engineers. Priced online in 90 seconds, no travel surcharge.',
    h1: 'Boiler servicing, repairs and installation in Southampton',
    intro:
      'Southampton is inside our regular coverage area, a short run down from Eastleigh with no travel surcharge. Rich and Kai, our Gas Safe registered engineers, are rated 5.0 stars from 13 Google reviews and handle boiler servicing, repairs and installation across the city, alongside landlord gas safety certificates for the private rented sector.',
    sections: [
      {
        heading: 'Landlords first',
        paragraphs: [
          'Southampton has one of the larger private rented sectors in the south, and a lot of what we do in the city is for landlords and letting agents rather than owner-occupiers: annual gas safety certificates, the repair that follows the certificate, and boiler replacement between tenancies when the property is empty and the work can be done without anyone’s shower being interrupted.',
          'If you own several properties in the city, the useful thing is usually not the price of a single CP12 but a calendar — one engineer who knows the portfolio, reminds you before each certificate expires, and can turn a failed appliance around quickly rather than leaving a property unlettable. That’s a conversation worth having on the phone.',
        ],
      },
      {
        heading: 'Older terraces, flats and awkward access',
        paragraphs: [
          'Much of the city’s rental stock is Victorian and Edwardian terraced housing, a good deal of it converted into flats. That brings its own recurring problems: shared or communal flue arrangements, meter positions that were sensible in 1965 and aren’t now, gas supply pipework that won’t support a modern boiler’s demand without upgrading, and parking that has to be planned rather than hoped for. We’d rather establish all of that at the survey than on the morning of the install.',
        ],
      },
    ],
    costs:
      'Boiler replacement mostly £2,400–£3,400 fitted for a like-for-like combi swap, with an indicative price online in about 90 seconds. Annual servicing from £100. Repairs at £100 for the first hour and £75 an hour after. Landlord gas safety certificates — call for a price, and ask about a rate if you have several properties.',
    faqs: [
      {
        question: 'Can you do certificates on several properties on the same day?',
        answer:
          'Usually, if they’re reasonably close together. Ring us with the addresses and we’ll work out what’s realistic.',
      },
      {
        question: 'What happens if an appliance fails the check?',
        answer:
          'We’ll tell you exactly what failed and what it takes to put right, and in most cases we can fix it there and then. An honest fail is worth more to you than a certificate that shouldn’t have been issued.',
      },
      {
        question: 'Do you work with letting agents?',
        answer:
          'Yes. Give us the agent’s details and we’ll deal with access and reporting directly rather than putting you in the middle.',
      },
      {
        question: 'How much notice do you need for a between-tenancy boiler swap?',
        answer:
          'A week from survey is typical, and we can often do better if the property’s empty and there’s a void period to hit.',
      },
    ],
    richToSupply:
      'A landlord certificate price and whether you’d do a multi-property rate. This page is aimed at landlords, the highest-repeat customer type available, and it’s much weaker without a number.',
    oldSlugs: [
      'new-boiler-southampton',
      'boiler-service-southampton',
      'emergency-plumber-southampton',
    ],
  },
  {
    slug: 'romsey',
    name: 'Romsey',
    tierLabel: 'Regular coverage',
    postcodes: 'SO51',
    title: 'Boiler installation & heating engineers, Romsey',
    metaDescription:
      'Gas Safe engineers covering Romsey, Ampfield and North Baddesley. New boilers priced online in 90 seconds, servicing from £100, repairs and emergency cover. Trading since 2009.',
    h1: 'Heating & plumbing in Romsey',
    intro:
      'Romsey, Ampfield and North Baddesley are all inside our regular coverage area. It’s a slightly longer run than Eastleigh, but there’s no travel surcharge and no difference in what you pay.',
    sections: [
      {
        heading: 'A market town’s worth of period property',
        paragraphs: [
          'Romsey grew up around its abbey — the largest parish church in Hampshire — and the centre still carries a lot of genuinely old building: a thirteenth-century King John’s House, an eighteenth-century coaching inn with a fifteenth-century timber frame behind it, and a good deal of Georgian and Victorian housing around them, with twentieth-century estates spreading out beyond.',
          'Old town-centre property tends to mean solid walls, restricted external elevations, and heating systems that have been added to piecemeal over decades rather than designed once. It’s not unusual to find three generations of pipework in one house. The right answer is often less dramatic than people expect — correct radiator sizing, a proper clean, and modern controls will do more for comfort in a house like that than simply bolting on a bigger boiler.',
          'Newer housing on the edges of the town is more straightforward, and generally a single-day swap.',
        ],
      },
    ],
    costs:
      'Like-for-like combi swaps mostly £2,400–£3,400 fitted, priced indicatively online in about 90 seconds and confirmed at a free survey. Servicing from £100, repairs at £100 for the first hour and £75 after, powerflushing from £600.',
    faqs: [
      {
        question: 'Is it worth replacing radiators at the same time as the boiler?',
        answer:
          'In an older house, often yes — undersized radiators are the most common reason a new boiler disappoints. Much cheaper done alongside the installation than as a separate job later.',
      },
      {
        question: 'Our house isn’t on mains gas. Can you help?',
        answer:
          'Tell us what you’ve got when you call and we’ll be straight with you about whether it’s our sort of work. We’d rather say no than take on something we’re not the right people for.',
      },
      {
        question: 'Do you cover Ampfield and North Baddesley?',
        answer: 'Yes, both, on the same terms as Romsey itself.',
      },
    ],
    richToSupply:
      'Whether you take on oil or LPG work at all. The FAQ above is deliberately non-committal until you say — better vague than wrong.',
    oldSlugs: [
      'new-boiler-romsey',
      'boiler-service-romsey',
      'emergency-plumber-romsey',
      'new-boiler-ampfield',
      'new-boiler-north-baddesley',
    ],
  },
  {
    slug: 'bishops-waltham',
    name: "Bishop's Waltham",
    tierLabel: 'Regular coverage',
    postcodes: 'SO32',
    title: "Heating & boiler engineers, Bishop's Waltham",
    metaDescription:
      "Gas Safe engineers covering Bishop's Waltham, Upham and Durley. Boiler replacement priced online in 90 seconds, servicing from £100, 24-hour emergency cover. Registered 503986.",
    h1: "Heating & plumbing in Bishop's Waltham",
    intro:
      "Bishop's Waltham, Upham and Durley are all within our regular coverage area. Around twenty-five minutes from Bishopstoke, and no surcharge for the distance.",
    sections: [
      {
        heading: 'Georgian high street, modern edges',
        paragraphs: [
          "Bishop's Waltham is a medieval market town and the largest settlement in the Winchester district outside the city itself. The centre is full of listed buildings and Georgian frontages — the sort of property where flue position and external pipework need thinking about before anyone orders a boiler — while the housing that has grown up around it over the last fifty years is far more conventional.",
          'We treat those as two different jobs, because they are. A 1980s house off the main road is usually a single-day swap. A Georgian building on the high street needs a longer survey, and possibly a conversation with the local authority, before we commit to a date. Either way we’d rather find out at the start.',
          'Something else worth mentioning: the villages around here are strung out along country lanes, and in a hard winter that matters. If you rely on your heating and your boiler is on borrowed time, it’s a much better idea to change it in the autumn than to find out in February.',
        ],
      },
    ],
    costs:
      'Combi swaps mostly £2,400–£3,400 fitted, priced online in about 90 seconds and confirmed at a free survey. Servicing from £100, repairs at £100 for the first hour and £75 an hour after. Powerflushing from £600.',
    faqs: [
      {
        question: 'How long would you be, in an emergency, out here?',
        answer:
          'Longer than in Eastleigh — we’re honest about that. We hold 24-hour cover and we’ll give you a realistic time on the phone rather than an optimistic one.',
      },
      {
        question: 'Do you cover Upham and Durley?',
        answer: 'Yes. Both are in our regular coverage area, along with the lanes between them.',
      },
      {
        question: 'Is there a best time of year to replace a boiler?',
        answer:
          'Late summer and early autumn. Lead times are shorter, you’re not doing it in a crisis, and you get the whole heating season out of the new one.',
      },
    ],
    oldSlugs: [
      'new-boiler-bishops-waltham',
      'boiler-service-bishops-waltham',
      'emergency-plumber-bishops-waltham',
      'new-boiler-upham',
      'new-boiler-durley',
      'boiler-service-durley',
      'emergency-plumber-durley',
    ],
  },
  {
    slug: 'botley',
    name: 'Botley',
    tierLabel: 'Regular coverage',
    postcodes: 'SO30 / SO32',
    title: 'Boiler repair, replacement and servicing in Botley',
    metaDescription:
      'Boiler repair, replacement and servicing in Botley from Rich and Kai, Gas Safe engineers. Priced online in 90 seconds, no travel surcharge.',
    h1: 'Boiler repair, replacement and servicing in Botley',
    intro:
      'Botley sits between Hedge End and the Waltham villages, on a route we’re driving most weeks anyway. Rich and Kai are Gas Safe registered, rated 5.0 stars from 13 Google reviews. Regular coverage, no travel surcharge, and generally easy to book in quickly.',
    sections: [
      {
        heading: 'Old village, new estates, one engineer',
        paragraphs: [
          'Botley is a place of two halves for anyone working on heating. There’s the old village — the square, the mill, the properties around them, some centuries old and none designed with a condensing boiler in mind — and then there’s the very substantial modern development that has gone up around Boorley Green and along the roads toward Hedge End.',
          'Older village property tends to need care with flue routing and honest conversations about heat loss. The newer estates are the opposite problem: everything is neat and standardised, which is fine until you discover the original developer’s boiler sits in a cupboard that a modern replacement won’t fit into without moving something. Both are perfectly doable. They just need surveying rather than guessing.',
          'Because we’re a two-man firm, the same person sees your house, prices the job, orders the parts and does the work. Nothing gets lost between a salesperson and a fitter, because there isn’t one.',
        ],
      },
    ],
    costs:
      'Combi swaps mostly £2,400–£3,400 fitted, with an indicative price online in about 90 seconds. Servicing from £100. Repairs at £100 for the first hour and £75 an hour afterwards, with no separate call-out fee. Powerflushing from £600.',
    faqs: [
      {
        question: 'Can you get here quickly if something’s leaking?',
        answer:
          'Botley’s within our regular area and we’re often nearby. Call rather than email — for anything urgent the phone is always fastest.',
      },
      {
        question: 'What if the new boiler won’t fit where the old one is?',
        answer:
          'Then we move it, and we tell you that at the survey with the cost included. It’s a common outcome on estate housing and it’s not a disaster.',
      },
      {
        question: 'Do you cover Boorley Green?',
        answer: 'Yes, and Curdridge and the lanes around them.',
      },
    ],
    oldSlugs: ['new-boiler-botley'],
  },
];

export function getTownPage(slug: string): TownPage | undefined {
  return townPages.find((t) => t.slug === slug);
}
