import type { ReactNode } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import classes from './PillButton.module.css';

type Props = {
  href: string;
  variant?: 'light' | 'dark';
  children: ReactNode;
};

export function PillButton({ href, variant = 'light', children }: Props) {
  return (
    <Link href={href} className={`${classes.pillBtn} ${variant === 'dark' ? classes.dark : ''}`}>
      {children}
      <span className={classes.circ}>
        <IconArrowRight size={16} />
      </span>
    </Link>
  );
}
