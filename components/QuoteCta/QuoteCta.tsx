import Image from 'next/image';
import { PillButton } from '@/components/PillButton/PillButton';
import { business } from '@/lib/business';
import classes from './QuoteCta.module.css';

export function QuoteCta() {
  return (
    <div className={classes.ctaBand}>
      <div className={classes.bg}>
        <Image
          src="/images/bg/CDi_Compact_-_Lifestyle.jpg"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div className={classes.overlay} />
      </div>
      <div className={classes.inner}>
        <div>
          <h2 className={classes.heading}>Your new boiler price, in 90 seconds</h2>
          <p className={classes.body}>
            Answer a few questions, get an indicative fitted price instantly. A free survey then
            confirms and locks in your price, no obligation.
          </p>
        </div>
        <div className={classes.ctas}>
          <PillButton href="/get-a-quote">Get my instant quote</PillButton>
          <a href={`tel:${business.phoneE164}`} className={classes.phoneLink}>
            Or just call {business.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}
