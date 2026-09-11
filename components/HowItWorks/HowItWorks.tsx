import { PillButton } from '@/components/PillButton/PillButton';
import classes from './HowItWorks.module.css';

const steps = [
  {
    number: 1,
    title: 'Answer a few questions',
    body: 'Tell us about your home and your current boiler, it takes about 90 seconds to run through our quick form.',
  },
  {
    number: 2,
    title: 'See your quote price instantly',
    body: "We'll show you fully-fitted prices for a choice of boilers, with details to help you pick the right one for your home.",
  },
  {
    number: 3,
    title: 'Free survey, then we fit it',
    body: "Rich comes out to confirm the price and lock it in. Nothing to pay until then, and we'll agree a fitting date that works for you.",
  },
];

export function HowItWorks() {
  return (
    <section className={classes.section}>
      <div className={classes.wrap}>
        <div className={classes.band}>
          <span className={classes.eyebrow}>How it works</span>
          <h2 className={classes.heading}>New boiler, sorted in three steps</h2>
          <div className={classes.steps}>
            {steps.map((step) => (
              <div key={step.number} className={classes.step}>
                <div className={classes.stepNum}>{step.number}</div>
                <h3 className={classes.stepTitle}>{step.title}</h3>
                <p className={classes.stepBody}>{step.body}</p>
              </div>
            ))}
          </div>
          <PillButton href="/get-a-quote">Start my quote</PillButton>
        </div>
      </div>
    </section>
  );
}
