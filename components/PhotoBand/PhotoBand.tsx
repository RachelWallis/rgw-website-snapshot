import Image from 'next/image';
import classes from './PhotoBand.module.css';

type Props = {
  src: string;
  objectPosition?: string;
  /** When set, the band becomes a page hero: taller, with this text overlaid
      as the page's <h1>. */
  title?: string;
};

/** Rounded, gradient-overlaid photo banner used above page content. Placeholder imagery until real per-page photography exists. */
export function PhotoBand({ src, objectPosition = 'center 40%', title }: Props) {
  return (
    <div className={`${classes.photoBand} ${title ? classes.withTitle : ''}`}>
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        preload={Boolean(title)}
        fetchPriority={title ? 'high' : undefined}
        style={{ objectFit: 'cover', objectPosition }}
      />
      {title && <h1 className={classes.title}>{title}</h1>}
    </div>
  );
}
