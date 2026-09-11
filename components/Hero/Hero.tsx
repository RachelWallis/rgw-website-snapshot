import Image from 'next/image';
import { IconPhone } from '@tabler/icons-react';
import { LogoEasterEgg } from '@/components/LogoEasterEgg/LogoEasterEgg';
import { PillButton } from '@/components/PillButton/PillButton';
import { business } from '@/lib/business';
import { HeroMobileNav } from './HeroMobileNav';
import { navLinks } from './navLinks';
import classes from './Hero.module.css';

type Props = {
  averageRating: number | null;
  totalRatings: number | null;
};

export function Hero({ averageRating, totalRatings }: Props) {
  // Google brand guidelines: describe ratings as "on Google" (not "Google
  // rating"), never place stars next to Google's logo, and disclose recency.
  const asOf = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className={classes.hero}>
      <div className={classes.heroBg}>
        <Image
          src="/images/bg/hero-utility-room.jpg"
          alt=""
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div className={classes.heroGradient} />
      </div>

      <div className={classes.heroTop}>
        <LogoEasterEgg>
          <a href="/" className={classes.brand}>
            <Image
              src="/images/logo/logo-hero.svg"
              alt="RGW Heating & Plumbing"
              width={379}
              height={35}
              preload
              className={classes.brandLogo}
            />
          </a>
        </LogoEasterEgg>
        <nav className={classes.navPill} aria-label="Primary">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={classes.heroTopActions}>
          {/* Tel links are only useful for tapping to dial on a phone, on
              desktop clicking one just tries (and usually fails) to launch a
              calling app, so show the number as plain text there instead.
              On mobile, ContactRail (site-wide) covers tap-to-call. */}
          <div className={classes.phoneDesktop}>
            <IconPhone size={16} />
            {business.phoneDisplay}
          </div>
          <HeroMobileNav />
        </div>
      </div>

      <div className={classes.heroMain}>
        <h1 className={classes.title}>
          A fitted boiler price in 90 seconds.
          <br />
          From the people who&rsquo;ll actually fit it.
        </h1>
        <p className={classes.subtitle}>
          RGW Heating & Plumbing is a family-run business based in Bishopstoke since{' '}
          {business.foundingYear}. RGW covers areas local to Eastleigh, Winchester, Southampton and
          everywhere in between.
        </p>
        <div className={classes.heroCtas}>
          <PillButton href="/get-a-quote">Get my boiler price</PillButton>
          <a href={`tel:${business.phoneE164}`} className={classes.phonePill}>
            <IconPhone size={16} />
            Call {business.phoneDisplay}
          </a>
        </div>
        <p className={classes.priceAnchor}>
          Most combi swaps cost between £2,400 and £3,400 fitted.
          <br /> We&rsquo;re a small family business, so you&rsquo;ll get a personal service from
          us.
        </p>
      </div>

      <div className={classes.heroBottom}>
        {averageRating !== null && (
          <div className={classes.revMini}>
            <Image src="/images/icons/google-g.svg" alt="Google" width={32} height={32} />
            <div>
              <div className={classes.revLabel}>
                {averageRating.toFixed(1)} on Google
                {totalRatings !== null ? ` · ${totalRatings} reviews` : ''}
              </div>
              <div className={classes.revAsOf}>as of {asOf}</div>
            </div>
          </div>
        )}
        <div className={classes.glass}>
          <div>
            <div className={classes.glassBig}>90 seconds</div>
            <div className={classes.glassLabel}>to your bespoke fitted boiler quote online</div>
          </div>
          {/* Button hidden on mobile (duplicates the hero CTA); the message stays. */}
          <div className={classes.glassCta}>
            <PillButton href="/get-a-quote">Start now</PillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
