import { business } from '@/lib/business';
import classes from './TrustStrip.module.css';

const items = [
  `Trading since ${business.foundingYear}`,
  `Gas Safe ${business.gasSafeNumber}`,
  '24-hour emergency cover',
];

export function TrustStrip() {
  return (
    <div className={classes.trust}>
      {items.map((label) => (
        <div key={label} className={classes.chip}>
          <span className={classes.dot} aria-hidden="true" />
          {label}
        </div>
      ))}
    </div>
  );
}
