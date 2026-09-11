import { IconBrandWhatsapp, IconPhone } from '@tabler/icons-react';
import { business } from '@/lib/business';
import classes from './EmergencyStrip.module.css';

/** Sits directly below the hero on the homepage — the missing path for the
    visitor who isn't shopping calmly, they've got water coming through the
    ceiling and need a phone number, not a form. */
export function EmergencyStrip() {
  return (
    <div className={classes.wrap}>
      <div className={classes.strip}>
        <div className={classes.copy}>
          <h2 className={classes.heading}>No heat, no hot water, or water you can&rsquo;t stop?</h2>
          <p className={classes.body}>
            Call {business.phoneDisplay}. We hold 24-hour emergency cover. £100 for the first hour,
            £75 an hour after, and no separate call-out fee on top. If it&rsquo;s something you can
            safely sort yourself, we&rsquo;ll tell you that on the phone rather than charge you to
            hear it.
          </p>
        </div>
        <div className={classes.actions}>
          <a href={`tel:${business.phoneE164}`} className={`${classes.btn} ${classes.call}`}>
            <IconPhone size={18} />
            Call now
          </a>
          <a
            href={business.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${classes.btn} ${classes.whatsapp}`}
          >
            <IconBrandWhatsapp size={18} />
            WhatsApp us
          </a>
        </div>
      </div>
    </div>
  );
}
