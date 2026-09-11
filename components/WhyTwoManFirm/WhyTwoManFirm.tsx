import { PillButton } from '@/components/PillButton/PillButton';
import classes from './WhyTwoManFirm.module.css';

/** Built from the already-approved copy on /meet-the-team (Rich's 30 years,
    Kai since 2021) — nothing here is a new claim. The real competition for
    boiler installs isn't the plumber down the road, it's the big
    boiler-in-a-box firms, and this is the argument against them. */
export function WhyTwoManFirm() {
  return (
    <section className={classes.section}>
      <div className={classes.wrap}>
        <div className={classes.card}>
          <h2 className={classes.heading}>
            The person who prices the job is the person who does it
          </h2>
          <p className={classes.body}>
            You won&rsquo;t get a salesperson, and you won&rsquo;t get whichever subcontractor
            happened to be free that week. Rich has been doing this for thirty years. Kai joined him
            in 2021. Between them, that&rsquo;s the whole company.
          </p>
          <p className={classes.body}>
            It means we take on fewer jobs than a bigger firm would. It also means the person
            standing in your kitchen is the person whose name is on the van — and that when you
            ring, you get Rich, not a call centre.
          </p>
          <PillButton href="/meet-the-team" variant="dark">
            Meet Rich and Kai
          </PillButton>
        </div>
      </div>
    </section>
  );
}
