import classes from './SolidBand.module.css';

/** Flat-colour rounded hero band for utility pages that don't warrant a photo (avoids repeating the small placeholder photo set too often). */
export function SolidBand() {
  return <div className={classes.band} />;
}
