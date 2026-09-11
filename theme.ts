'use client';

import { createTheme, MantineColorsTuple } from '@mantine/core';

// Calm Premium rebrand (2026-07): green replaces the old blue/orange pair.
// Tuple keys stay rgwBlue/rgwOrange so every existing `color="rgwBlue"` /
// `color="rgwOrange"` reference across the app (incl. quote-engine, which is
// frozen except for bugfixes) repaints green without touching that code.
const rgwBlue: MantineColorsTuple = [
  '#e9f8ee',
  '#cbeeda',
  '#9fdfb9',
  '#6ece97',
  '#45bf7b',
  '#28b366',
  '#1e9e4b',
  '#188d40',
  '#137a36',
  '#0d5f2b',
];

const rgwOrange: MantineColorsTuple = [
  '#e6f5ea',
  '#c0e6cc',
  '#8fd3a8',
  '#5cbe81',
  '#33a964',
  '#1d9752',
  '#137038',
  '#0f6330',
  '#0b5228',
  '#07401f',
];

export const theme = createTheme({
  primaryColor: 'rgwBlue',
  // Shade 9 (not Mantine's default 6) — white button text on shade 6 was only
  // 3.47:1, below WCAG AA. Shade 9 gives 7.81:1 on rgwBlue (AAA for normal text).
  primaryShade: 9,
  colors: {
    rgwBlue,
    rgwOrange,
  },
  black: '#101614',
  fontFamily: 'var(--font-figtree), Figtree, sans-serif',
  headings: {
    fontFamily: 'var(--font-figtree), Figtree, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'lg',
});
