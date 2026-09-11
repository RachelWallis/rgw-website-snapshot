import classes from './ProblemsSolved.module.css';

export type ServiceCard = {
  problem: string;
  answer: string;
  href: string;
  linkLabel: string;
};

/** Shared white-card grid used on the homepage ("Services we offer") and the
    /what-we-do page. */
export function ServiceCardGrid({ items }: { items: ServiceCard[] }) {
  return (
    <div className={classes.cards}>
      {items.map((p) => (
        <div key={p.problem} className={classes.card}>
          <div className={classes.body}>
            <h3 className={classes.cardTitle}>{p.problem}</h3>
            <p className={classes.cardText}>{p.answer}</p>
            <a href={p.href} className={classes.cardLink}>
              {p.linkLabel} →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
