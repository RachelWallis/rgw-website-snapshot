import { IconBrandWhatsapp, IconMail, IconPhone } from '@tabler/icons-react';
import { business } from '@/lib/business';
import classes from './ContactRail.module.css';

const links = [
  {
    href: business.whatsappUrl,
    label: 'WhatsApp us',
    icon: IconBrandWhatsapp,
    className: classes.whatsapp,
    external: true,
  },
  {
    href: `tel:${business.phoneE164}`,
    label: `Call ${business.phoneDisplay}`,
    icon: IconPhone,
    className: classes.call,
    external: false,
  },
  {
    href: `mailto:${business.email}`,
    label: 'Email us',
    icon: IconMail,
    className: classes.email,
    external: false,
  },
] as const;

/** Fixed quick-contact rail docked to the left edge, mobile only (matches the
    site's 80em burger-nav breakpoint, see HeaderMegaMenu.module.css). Replaces
    the standalone header phone buttons (Hero's phoneMobile pill, HeaderMegaMenu's
    mobile call icon) with one persistent set of contact channels site-wide. */
export function ContactRail() {
  return (
    <nav aria-label="Quick contact" className={classes.rail}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          className={`${classes.btn} ${link.className}`}
          {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <link.icon size={22} stroke={1.75} />
        </a>
      ))}
    </nav>
  );
}
