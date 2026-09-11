import Link from 'next/link';
import { getAllArticles } from '@/sanity/queries';
import classes from './AdviceTeaser.module.css';

/** Same graceful-degradation pattern as ReviewsTeaser: renders nothing when
    there's no real content, rather than linking to article slugs that
    don't exist. Sanity isn't configured in every environment (see
    RGW-029), so this starts showing content the moment it is. */
export async function AdviceTeaser() {
  const articles = await getAllArticles();

  if (articles.length === 0) {
    return null;
  }

  const featured = articles.slice(0, 3);

  return (
    <section className={classes.section}>
      <div className={classes.wrap}>
        <div className={classes.secHead}>
          <span className={classes.eyebrow}>Help &amp; advice</span>
          <h2 className={classes.heading}>Before you spend anything</h2>
        </div>

        <div className={classes.list}>
          {featured.map((article) => (
            <Link
              key={article._id}
              href={`/help-and-advice/${article.slug}`}
              className={classes.item}
            >
              {article.title}
            </Link>
          ))}
        </div>

        <Link href="/help-and-advice" className={classes.viewAll}>
          All our advice →
        </Link>
      </div>
    </section>
  );
}
