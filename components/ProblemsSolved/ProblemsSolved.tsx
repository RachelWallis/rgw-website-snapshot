import { business } from '@/lib/business';
import { ServiceCardGrid, type ServiceCard } from './ServiceCardGrid';
import classes from './ProblemsSolved.module.css';

/** The full service list — shown on the /what-we-do page. */
export const serviceCards: ServiceCard[] = [
  {
    problem: 'Emergency boiler repairs',
    answer: `All jobs are charged at a minimum of £100 (incl VAT) for the first hour, £75 after that (incl VAT). Call ${business.phoneDisplay} and we'll talk you through it right away.`,
    href: `tel:${business.phoneE164}`,
    linkLabel: 'Call us now',
  },
  {
    problem: 'New boiler installations',
    answer:
      "We'll always repair your boiler if it makes economic sense. But beyond a certain age, new parts often cost more than they're worth, so a replacement makes better sense. Get a fully fitted price online in 90 seconds.",
    href: '/get-a-quote',
    linkLabel: 'Get an instant quote',
  },
  {
    problem: 'Gas central heating',
    answer:
      'Full central heating installations, upgrades and replacements, sized to your home so every room actually warms up. Since 2009, mostly on recommendation.',
    href: '/what-we-do/gas-central-heating',
    linkLabel: 'About central heating',
  },
  {
    problem: 'Radiator installation & changes',
    answer:
      'Add radiators to cold rooms, swap tired ones for efficient modern panels, or move them for a new layout, including towel rails and zoned controls.',
    href: '/what-we-do/radiator-installation',
    linkLabel: 'About radiators',
  },
  {
    problem: 'Smart heating controls',
    answer:
      'Hive, Nest or Tado fitted and set up so you can control your heating from your phone and cut your bills. We fit the one that suits your system, not the priciest box.',
    href: '/what-we-do/gas-central-heating',
    linkLabel: 'Talk to us',
  },
  {
    problem: 'Powerflushing',
    answer:
      'Radiators cold at the bottom is a classic sign of sludge in the system. A powerflush clears it, cures cold spots and cuts your gas use. Recommended alongside a new boiler install to keep your system in top condition. Prices from £600 (incl VAT).',
    href: '/what-we-do/powerflushing',
    linkLabel: 'About powerflushing',
  },
  {
    problem: 'General plumbing',
    answer:
      'We offer a wide range of plumbing services, including leaks, taps, toilets, baths and showers. All work is carried out to a high standard with a 12 month guarantee.',
    href: '/what-we-do/general-plumbing',
    linkLabel: 'General plumbing',
  },
  {
    problem: 'Annual boiler service',
    answer:
      "A thorough inspection of your boiler and heating system to make sure it's running safely and efficiently, plus a written report on anything that needs attention. An annual service also keeps your manufacturer's warranty valid. Prices from £100 (incl VAT).",
    href: '/what-we-do/boiler-services',
    linkLabel: 'About boiler servicing',
  },
  {
    problem: 'Landlord safety certificates',
    answer:
      "CP12 gas safety checks with tenant liaison handled for you, and a reminder before next year's is due.",
    href: '/what-we-do/landlord-safety-certificates',
    linkLabel: 'Landlord certificates',
  },
];

/** Homepage teaser — a curated, conversion-focused set that points into the
    full list, rather than duplicating it. */
const homeCards: ServiceCard[] = [
  {
    problem: 'Try our interactive quote tool',
    answer:
      'Answer a few quick questions and get an indicative fitted price for a new boiler on the spot, with a choice of boilers at fully-fitted prices. A free survey then confirms and locks it in.',
    href: '/get-a-quote',
    linkLabel: 'Get my instant quote',
  },
  {
    problem: 'Local & Gas Safe since 2009',
    answer:
      'RGW is Rich and Kai: two Gas Safe registered engineers, trading since 2009 and busy mostly through word of mouth. No subcontractors, no call centre.',
    href: '/meet-the-team',
    linkLabel: 'Meet the team',
  },
  {
    problem: 'What services do we offer?',
    answer:
      'From new boilers and full central heating to servicing, powerflushing, landlord certificates and everyday plumbing, we cover the lot across South Hampshire.',
    href: '/what-we-do',
    linkLabel: 'See our services',
  },
];

export function ProblemsSolved() {
  return (
    <section className={classes.section}>
      <div className={classes.wrap}>
        <div className={classes.secHead}>
          <span className={classes.eyebrow}>Why RGW</span>
          <h2 className={classes.heading}>Local, family-run and Gas Safe registered</h2>
          <p className={classes.subheading}>
            A local, Gas Safe registered heating and plumbing team you can trust, with an instant
            online price when you need a new boiler.
          </p>
        </div>

        <ServiceCardGrid items={homeCards} />
      </div>
    </section>
  );
}
