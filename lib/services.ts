import {
  IconCertificate2,
  IconDeviceMobile,
  IconDropletCog,
  IconHeartCog,
  IconRipple,
  IconTool,
} from '@tabler/icons-react';
import type { EnquiryKey } from './enquiries';
import type { Faq } from './schema';

/** One distinct job within a service (e.g. "Boiler repairs"), with its own
    details and FAQs so each page reads as separate, explicit sections. */
export type ServiceJob = {
  title: string;
  blurb: string;
  points: string[];
  faqs: Faq[];
};

export type ServiceContent = {
  slug: string;
  icon: typeof IconTool;
  name: string;
  /** Short blurb (mega menu / reference). */
  short: string;
  metaTitle: string;
  metaDescription: string;
  /** Short label for the hero overlay, reflecting the URL (e.g. "General plumbing"). */
  heroTitle: string;
  /** Descriptive tagline shown as a heading just below the hero. */
  tagline: string;
  intro: string;
  /** Optional hero background photo (public/images/bg). */
  heroImage?: string;
  /** The distinct jobs we do within this service. */
  jobs: ServiceJob[];
  /** Primary CTA style: instant quote wizard or phone-first. */
  cta: 'quote' | 'call';
  /** Optional extra CTA for work a customer can ask for online without a
      phone call — planned jobs like an annual service, which fill quiet
      slots rather than adding call-outs. Opens /contact-us with the message
      written; the key must exist in lib/enquiries.ts. */
  enquiryCta?: { label: string; enquiry: EnquiryKey };
};

export const services: ServiceContent[] = [
  {
    slug: 'boiler-services',
    icon: IconHeartCog,
    name: 'Boiler Services & Repairs',
    short: 'We service and repair your boiler, always aiming for a repair when possible.',
    metaTitle: 'Boiler servicing and repairs in Eastleigh and Southampton',
    metaDescription:
      'Gas Safe boiler servicing and repairs in Eastleigh, Southampton and Winchester. Fixed prices online, and honest advice on repair vs replace.',
    heroTitle: 'Boiler services & repairs',
    tagline: 'Repairs, servicing and new boilers',
    heroImage: '/images/bg/Worcester_Bosch_8000_Utility_560x466.jpg',
    intro:
      'Boiler servicing, repairs and new installations across Eastleigh, Southampton and Winchester. We always aim to repair before replacing, an annual service keeps things safe and efficient, and if you do need a new boiler, a fitted price is a phone call away. Combi, system and heat-only, covered under one roof.',
    jobs: [
      {
        title: 'New boiler installations',
        blurb:
          "If you need a new boiler, you don't need to wait in for a salesperson. See fitted prices for a choice of boilers online in about 90 seconds, then Rich or Kai confirm everything at a free survey before any money changes hands.",
        points: [
          'Fixed, fully-fitted prices with VAT included',
          'Combi, system and heat-only boilers',
          '10-year manufacturer warranties on the Worcester Bosch Greenstar 4000 and 8000+ ranges',
          'Old boiler removed and disposed of',
          'A free survey to confirm and lock in your price',
        ],
        faqs: [
          {
            question: 'How much does a new boiler cost?',
            answer:
              'Most like-for-like combi swaps come in between £2,400 and £3,400 fitted, depending on the boiler and your home. Use our instant quote tool for a price specific to your house, it takes about 90 seconds and there’s no obligation.',
          },
          {
            question: 'Which boiler brands do you install?',
            answer:
              'Mostly Ideal and Worcester Bosch, because their reliability and warranty support are excellent, up to 12 years on the Worcester Bosch 8000 range. We can fit other brands on request.',
          },
        ],
      },
      {
        title: 'Boiler repairs',
        blurb:
          "Boiler stopped working, making noise, or losing pressure? We repair rather than replace wherever it's economical to do so, and we'll always tell you honestly when it isn't.",
        points: [
          'Fault-finding and repairs on all major brands',
          'No heating or hot water, leaks, pressure loss and error codes',
          'Minimum charge £100 (incl VAT) for the first hour, £75 after (incl VAT)',
          '24-hour emergency cover across our South Hampshire patch',
          'Straight advice on whether a repair or a replacement is the better spend',
        ],
        faqs: [
          {
            question: 'My boiler has stopped working, how quickly can you come out?',
            answer:
              'We offer 24-hour emergency cover across our South Hampshire patch. Call 07969 110679 and we’ll get to you as fast as we can, same day for most of the Eastleigh area.',
          },
          {
            question: 'Is it worth repairing an older boiler?',
            answer:
              "We'll always repair your boiler if it makes economic sense. But beyond a certain age, new parts often cost more than they're worth, so a replacement makes better sense, and we'll tell you honestly which is which.",
          },
        ],
      },
      {
        title: 'Annual boiler servicing',
        blurb:
          "An annual service keeps your boiler safe, efficient and your manufacturer's warranty valid, plus a written report on anything that needs attention before next year.",
        points: [
          'Burner and heat exchanger checks, flue gas analysis, seals, pressure and controls',
          'A written report on anything that needs attention',
          'Keeps most manufacturer warranties valid',
          'Prices from £100 (incl VAT)',
          'Combine it with a landlord certificate for a reduced price',
        ],
        faqs: [
          {
            question: 'How often should my boiler be serviced?',
            answer:
              'Once a year. Most manufacturer warranties are only valid with an annual service by a Gas Safe registered engineer, and a serviced boiler runs more efficiently and fails less often.',
          },
        ],
      },
    ],
    cta: 'quote',
    enquiryCta: { label: 'Request a boiler service', enquiry: 'boiler-service' },
  },
  {
    slug: 'gas-central-heating',
    icon: IconDeviceMobile,
    name: 'Gas Central Heating',
    short: 'Full central heating installation, upgrades and replacements.',
    metaTitle: 'Gas central heating installation in South Hampshire',
    metaDescription:
      'Full gas central heating systems designed, installed and upgraded by Gas Safe engineers across Eastleigh, Winchester and Southampton. Trading since 2009.',
    heroTitle: 'Gas central heating',
    tagline: 'Installation, upgrades & smart controls',
    heroImage: '/images/bg/hero-utility-room.jpg',
    intro:
      'Whole-system central heating: brand-new systems for homes that have never had it, upgrades and replacements where a tired system is costing you money, and the smart controls that tie it all together, sized to your home so every room actually gets warm.',
    jobs: [
      {
        title: 'New central heating systems',
        blurb:
          'A complete system designed and installed for a home that has never had central heating, or a full replacement, sized properly and installed to Gas Safe standards.',
        points: [
          'Full system design: boiler sizing, radiator placement and controls',
          'Installed to Gas Safe standards (registration 503986)',
          'Every room balanced so it actually warms up',
          'Pipework routed to keep disruption to a minimum',
        ],
        faqs: [
          {
            question: 'How long does a full central heating installation take?',
            answer:
              'A typical three-bed house takes three to five days depending on the amount of pipework. We agree the schedule with you up front and keep disruption to a minimum, water and heating are back on each evening wherever possible.',
          },
        ],
      },
      {
        title: 'Upgrades, replacements & extensions',
        blurb:
          'Extending an existing system, replacing a tired one, or adding a room, we check the boiler has the capacity first, then add radiators, zones or pipework to suit.',
        points: [
          'Add radiators, towel rails or separate heating zones',
          'Replace tired systems that waste money and comfort',
          'Boiler capacity checked before we extend anything',
          'Pipework re-routing and upgrades',
        ],
        faqs: [
          {
            question: 'Can you add radiators or zones to my existing system?',
            answer:
              'Yes, extending an existing system is often straightforward. We check the boiler has the capacity first, then add radiators, towel rails or separate heating zones with their own controls.',
          },
        ],
      },
      {
        title: 'Smart thermostats & controls',
        blurb:
          'Hive, Nest or Tado fitted and set up so you can control your heating from your phone and cut your bills, we recommend the one that suits your system and habits, not the priciest box.',
        points: [
          'Hive, Nest and Tado supplied and fitted',
          'Zoned controls for larger or multi-storey homes',
          'Boiler Plus compliant heating controls',
          'Set up and explained in plain English',
        ],
        faqs: [
          {
            question: 'Do you fit smart thermostats?',
            answer:
              'Yes. We regularly fit Hive, Nest and Tado, and we’ll recommend the one that suits your system and habits rather than the most expensive box.',
          },
        ],
      },
    ],
    cta: 'quote',
  },
  {
    slug: 'landlord-safety-certificates',
    icon: IconCertificate2,
    name: 'Landlord Safety Certificates',
    short:
      'CP12 Gas Safety certificates for rental properties, booked in advance, single or whole portfolio.',
    metaTitle: 'Landlord gas safety certificates (CP12) in South Hampshire',
    metaDescription:
      'CP12 landlord gas safety certificates across Eastleigh, Winchester and Southampton from a Gas Safe registered engineer. Portfolios and letting agents welcome, batch-scheduled with one renewal calendar. Annual reminders so your certificate never lapses.',
    heroTitle: 'Landlord certificates',
    tagline: 'CP12 gas safety certificates, sorted for you',
    heroImage: '/images/bg/Worcester_Bosch_8000_Utility_736x414.jpg',
    intro:
      'Every rental property with gas appliances legally needs a gas safety check every 12 months. We make it painless: a fixed price, flexible access, the option to service the boiler at the same time, and a reminder before it’s due again.',
    jobs: [
      {
        title: 'CP12 gas safety certificates',
        blurb:
          'The annual legal gas safety check for rental properties, with the certificate issued on the spot and emailed to you and your agent.',
        points: [
          'CP12 inspection of every gas appliance and flue',
          'Certificate issued on the spot, emailed to you and your agent',
          'Tenant liaison and key pick-up by arrangement',
          'Anything that needs work quoted separately and clearly, no surprises on the invoice',
        ],
        faqs: [
          {
            question: 'What does a CP12 gas safety check include?',
            answer:
              'A Gas Safe registered engineer checks every gas appliance in the property, boiler, hob, fire, plus flues and pipework, for safe operation, gas tightness and ventilation. You get the CP12 certificate as soon as the check is complete.',
          },
        ],
      },
      {
        title: 'Service and certificate together',
        blurb:
          "Have the boiler serviced at the same visit for a reduced combined price, one trip, one bill, and the boiler's warranty stays valid.",
        points: [
          'Boiler service at the same visit for a reduced combined price',
          'One visit, one price, less disruption for your tenant',
          'Keeps the manufacturer warranty valid',
        ],
        faqs: [
          {
            question: 'Can you do the boiler service at the same time?',
            answer:
              'Yes, and it’s the most cost-effective way to do both, one visit, one combined price, and the boiler warranty stays valid.',
          },
        ],
      },
      {
        title: 'Reminders & compliance',
        blurb:
          'We send a reminder before your certificate is due so you never drift out of compliance, and if access fails we rebook quickly rather than leaving it hanging.',
        points: [
          'Annual reminders before your certificate expires',
          'Flexible access and key arrangements',
          'Quick rebooking if access fails',
        ],
        faqs: [
          {
            question: 'When should I book the annual check?',
            answer:
              'Any time in the two months before the current certificate expires, the renewal date stays the same, so booking early never costs you cover. We send reminders so it doesn’t slip.',
          },
        ],
      },
      {
        title: 'Portfolios & letting agents',
        blurb:
          'Managing more than one rental? We schedule the whole portfolio together, deal with one point of contact, and keep every certificate on a single renewal calendar so nothing lapses between properties.',
        points: [
          'Certificates for your whole portfolio batched and scheduled together',
          'One point of contact, so you are not re-explaining access arrangements property by property',
          'A single renewal calendar across every property, no certificate quietly expiring while you are tracking the others',
          'Consolidated invoicing on request for agents managing certificates on behalf of landlords',
        ],
        faqs: [
          {
            question:
              'Do you cover gas safety certificates for a whole portfolio, not just one property?',
            answer:
              'Yes. We work with landlords and letting agents managing multiple rental properties across South Hampshire, batch-scheduling visits and keeping every certificate on one renewal calendar rather than treating each property as a one-off booking.',
          },
        ],
      },
    ],
    cta: 'call',
  },
  {
    slug: 'radiator-installation',
    icon: IconDropletCog,
    name: 'Radiator Installation & Changes',
    short: 'Add radiators to cold rooms, upgrade tired ones or move them for a new layout.',
    metaTitle: 'Radiator installation, replacement & moving in South Hampshire',
    metaDescription:
      'Radiator installation and replacement across Eastleigh, Winchester and Southampton, cold rooms fixed, towel rails and designer radiators fitted, radiators moved for renovations.',
    heroTitle: 'Radiator installation',
    tagline: 'Installed, replaced and moved',
    heroImage: '/images/bg/Worcester_Bosch_8000_Utility_560x466.jpg',
    intro:
      'Cold room that never warms up? Renovating and need radiators moved? Tired panels that belong in the 1980s? Radiator work is bread-and-butter for us, sized properly so the room actually gets warm.',
    jobs: [
      {
        title: 'New radiators & replacements',
        blurb:
          'Add radiators to cold rooms or swap tired panels for efficient modern ones. We size each radiator for the room, too small and it never warms up, too big and it wastes money.',
        points: [
          'New radiators added to existing systems',
          'Old radiators replaced with efficient modern panels',
          'Sized properly for the room, not guessed',
          'Thermostatic radiator valves (TRVs) fitted and balanced',
        ],
        faqs: [
          {
            question: 'Why is one radiator always cold?',
            answer:
              'Commonly trapped air, a stuck valve, or sludge in the system. It’s often a quick fix; if the system needs a powerflush we’ll show you why before recommending it.',
          },
        ],
      },
      {
        title: 'Moving radiators for renovations',
        blurb:
          'Doing up a kitchen or bathroom? We move radiators with the most discreet pipe routing available, and we’re upfront about any making-good before we start.',
        points: [
          'Radiators moved for kitchen and bathroom renovations',
          'Pipework run under floors where access allows',
          'Honest about any making-good that will be needed',
          'Floors and furniture protected, system refilled and rebalanced',
        ],
        faqs: [
          {
            question: 'Can you move a radiator without redecorating the whole room?',
            answer:
              'Usually, yes. Pipework is run in the most discreet route available, under floors where access allows, and we’re upfront about any making-good that will be needed.',
          },
        ],
      },
      {
        title: 'Towel rails & designer radiators',
        blurb:
          "Towel rails and designer radiators supplied at trade prices, or we'll fit ones you've already bought, we just check the sizing works for the room first.",
        points: [
          'Towel rails and designer radiators supplied and fitted',
          'Supplied at trade prices, or fit your own',
          'Sizing checked so it still heats the room',
        ],
        faqs: [
          {
            question: 'Do you supply the radiators or can I buy my own?',
            answer:
              'Either. We supply at trade prices, or fit radiators and towel rails you’ve already bought, we’ll just check the sizing works for the room first.',
          },
        ],
      },
    ],
    cta: 'call',
  },
  {
    slug: 'general-plumbing',
    icon: IconTool,
    name: 'General Plumbing',
    short:
      'We fit and fix all aspects of general plumbing including taps, toilets, valves, outside taps, sinks and basins.',
    metaTitle: 'Plumber in South Hampshire, taps, leaks & general plumbing',
    metaDescription:
      'Reliable plumber covering Eastleigh, Winchester and Southampton for leaks, taps, toilets, valves and outside taps. 24-hour emergency cover.',
    heroTitle: 'General plumbing',
    tagline: 'The everyday jobs done properly',
    heroImage: '/images/bg/hero-utility-room.jpg',
    intro:
      'The small jobs matter: a dripping tap wastes water and patience, a weeping valve becomes a ceiling stain, and a running toilet quietly inflates your water bill. We fix them properly, first time, and the same engineer who installs a full heating system will happily swap a tap washer.',
    jobs: [
      {
        title: 'Taps, leaks & valves',
        blurb:
          'Dripping taps, weeping valves and hidden leaks found and fixed properly, first time, before they turn into a bigger, more expensive problem.',
        points: [
          'Leaks found and fixed, visible or hidden',
          'Taps repaired and replaced',
          'Stopcocks, isolation valves and pressure problems sorted',
          'All work to a high standard with a 12-month guarantee',
        ],
        faqs: [
          {
            question: 'I have a leak but can’t see where it’s coming from, can you help?',
            answer:
              'Yes. Tracing hidden leaks is detective work we do regularly, we find the source before opening anything up, so the repair is as small as possible.',
          },
        ],
      },
      {
        title: 'Toilets, sinks, basins & outside taps',
        blurb:
          'Running toilets, tired fill valves and flush mechanisms, plus sinks, basins and outside taps, fitted and fixed without fuss.',
        points: [
          'Toilets: fill valves, flush mechanisms and full replacements',
          'Sinks and basins fitted',
          'Outside taps fitted from your existing supply',
        ],
        faqs: [
          {
            question: 'Can you fit an outside tap?',
            answer:
              'Yes, it’s a common job. We fit it off your existing supply with its own isolation valve, so it can be turned off and drained down before winter.',
          },
        ],
      },
      {
        title: 'Emergency plumbing',
        blurb:
          'Burst pipe or a leak you can’t stop? We run 24-hour cover across our patch. Turn the water off at the stopcock if you can, then call, describing what you can see helps us arrive with the right parts.',
        points: [
          '24-hour emergency cover across our patch',
          'Burst pipes and uncontainable leaks',
          'Same-day for urgent jobs in and around Eastleigh',
        ],
        faqs: [
          {
            question: 'Can you come out the same day?',
            answer:
              'For urgent problems in and around Eastleigh, usually yes. Genuine emergencies are covered 24 hours a day. Call rather than email for anything urgent.',
          },
        ],
      },
    ],
    cta: 'call',
  },
  {
    slug: 'powerflushing',
    icon: IconRipple,
    name: 'Powerflushing',
    short: 'Restore efficiency to a sludged-up heating system and cure cold radiators.',
    metaTitle: 'Powerflushing in South Hampshire, cure cold radiators',
    metaDescription:
      'Professional powerflushing across Eastleigh, Winchester and Southampton. Cure cold spots on radiators, cut boiler noise and restore heating efficiency.',
    heroTitle: 'Powerflushing',
    tagline: 'Bring a tired heating system back to life',
    heroImage: '/images/bg/Worcester_Bosch_8000_Utility_736x414.jpg',
    intro:
      'Radiators cold at the bottom, a boiler that kettles and bangs, heating that takes an age to warm up: classic signs of sludge. A powerflush clears it out, restores circulation, and a magnetic filter keeps it from coming back.',
    jobs: [
      {
        title: 'Full system powerflush',
        blurb:
          'A professional flush clears the sludge, rusty water and debris that settles out of an unprotected system, the single most common reason radiators develop cold patches and boilers cut out.',
        points: [
          'Full system flush with a professional flushing rig',
          'Chemical treatment and fresh inhibitor dosing',
          'Radiator-by-radiator temperature check before and after',
          'Typically improves heat-up times and can cut gas use',
        ],
        faqs: [
          {
            question: 'How do I know if my system needs a powerflush?',
            answer:
              'Typical signs: radiators cold at the bottom but hot at the top, black water when you bleed them, banging or kettling from the boiler, and rooms taking much longer to heat than they used to.',
          },
          {
            question: 'How long does a powerflush take?',
            answer:
              'Most homes take between half a day and a full day depending on the number of radiators and how badly sludged the system is.',
          },
        ],
      },
      {
        title: 'Magnetic filter fitting',
        blurb:
          'A magnetic filter fitted after the flush captures circulating debris and keeps the system clean, so the cold spots and boiler noise don’t creep back.',
        points: [
          'Magnetic system filter fitted after the flush',
          'Captures circulating debris before it settles',
          'Keeps the system clean for the long term',
        ],
        faqs: [
          {
            question: 'Will a powerflush fix my cold radiator for good?',
            answer:
              'Combined with fresh inhibitor and a magnetic filter, yes, the flush clears the sludge and the filter and inhibitor stop it coming back.',
          },
        ],
      },
      {
        title: 'Flush before a new boiler',
        blurb:
          'Putting a new boiler onto an older system? A flush protects the new boiler from existing sludge and is often required to keep its warranty intact.',
        points: [
          'Protects your new boiler from old system sludge',
          'Often required to keep the new boiler’s warranty valid',
          'Booked alongside a new boiler install',
        ],
        faqs: [
          {
            question: 'Do I need a powerflush with a new boiler?',
            answer:
              'On an older system, usually yes. A flush protects the new boiler from existing sludge and is often required by the manufacturer to keep the warranty valid. On a clean, newer system it may not be needed, and we’ll tell you honestly.',
          },
        ],
      },
    ],
    cta: 'quote',
  },
];

export function getService(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}
