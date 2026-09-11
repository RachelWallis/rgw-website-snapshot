import { business } from '@/lib/business';
import { enquiryHref } from '@/lib/enquiries';
import classes from './HomePricing.module.css';

type PriceCard = {
  label: string;
  price: string;
  href: string;
};

/** Prices cross-checked against lib/quote/catalogue.ts (boiler install) and
    the equivalent copy already live on /what-we-do (the rest) — nothing
    here is a new number. Landlord certificates has no confirmed price yet
    (flagged in RGW-029), so it gets a call-to-ask instead of an invented
    figure. */
const cards: PriceCard[] = [
  { label: 'New boiler installation', price: '£2,400–£3,400 fitted', href: '/get-a-quote' },
  {
    label: 'Annual boiler service',
    price: 'from £100',
    // Straight to the prefilled enquiry (RGW-057): the service page it used
    // to point at leads only to the new-boiler funnel or the phone.
    href: enquiryHref('boiler-service'),
  },
  {
    label: 'Repairs & emergencies',
    price: '£100 first hour, £75 after',
    href: `tel:${business.phoneE164}`,
  },
  { label: 'Powerflushing', price: 'from £600', href: '/what-we-do/powerflushing' },
  {
    label: 'Landlord gas certificates',
    price: 'Ask us for a price',
    href: '/what-we-do/landlord-safety-certificates',
  },
  {
    label: 'General plumbing',
    price: '12-month guarantee on our work',
    href: '/what-we-do/general-plumbing',
  },
];

export function HomePricing() {
  return (
    <section className={classes.section}>
      <div className={classes.wrap}>
        <div className={classes.secHead}>
          <span className={classes.eyebrow}>Prices</span>
          <h2 className={classes.heading}>Our prices at a glance</h2>
          <p className={classes.subheading}>
            If we can&rsquo;t tell you what something costs before we start, we&rsquo;ll tell you
            why.
          </p>
        </div>

        <div className={classes.grid}>
          {cards.map((card) => (
            <a key={card.label} href={card.href} className={classes.card}>
              <span className={classes.label}>{card.label}</span>
              <span className={classes.price}>{card.price}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
