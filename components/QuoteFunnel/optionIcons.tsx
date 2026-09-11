import type { JSX, ReactNode } from 'react';

/**
 * Inline SVG line-diagram icons for the funnel's option tiles (RGW-044).
 *
 * These replace keyword-matched Tabler glyphs for the questions where the glyph
 * was unhelpful or plain wrong — the boiler-type step (a "standard" boiler was a
 * military tank), the water-tank step (two different answers shared that same
 * tank glyph, and "No" was a bare X that reads as an error), and the property
 * step (a mix of emoji and Tabler outlines that didn't show the actual
 * distinction). The job is to help a homeowner recognise their own airing
 * cupboard, so these are literal little drawings, not decoration.
 *
 * Rules kept here: same stroke weight/colour as the rest of the funnel
 * (currentColor, so light/dark theme for free), no external assets, aria-hidden
 * (the visible option label carries the meaning), and every icon distinct so no
 * two options on a question ever share one.
 */

type IconProps = { size?: number };

function Svg({ size = 28, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* --- boiler type: one box / box+cylinder / box+cylinder+loft tank --- */

const BoilerCombi = ({ size }: IconProps) => (
  <Svg size={size}>
    <rect x="8" y="5" width="8" height="11" rx="1.2" />
    <line x1="10" y1="16" x2="10" y2="19" />
    <line x1="14" y1="16" x2="14" y2="19" />
    <line x1="10.5" y1="8.5" x2="13.5" y2="8.5" />
    <circle cx="12" cy="12" r="1.4" />
  </Svg>
);

const BoilerSystem = ({ size }: IconProps) => (
  <Svg size={size}>
    <rect x="3" y="5" width="7" height="9" rx="1.1" />
    <line x1="5" y1="14" x2="5" y2="17" />
    <line x1="8" y1="14" x2="8" y2="17" />
    <line x1="4.5" y1="7.5" x2="8.5" y2="7.5" />
    <rect x="14" y="5" width="6" height="14" rx="3" />
    <line x1="14" y1="10" x2="20" y2="10" />
  </Svg>
);

const BoilerStandard = ({ size }: IconProps) => (
  <Svg size={size}>
    <rect x="4" y="2" width="9" height="4" rx="0.6" />
    <line x1="8.5" y1="6" x2="8.5" y2="9" />
    <rect x="3" y="9" width="7" height="8" rx="1.1" />
    <line x1="5" y1="17" x2="5" y2="19.5" />
    <line x1="8" y1="17" x2="8" y2="19.5" />
    <rect x="14" y="8" width="6" height="11" rx="3" />
    <line x1="14" y1="12.5" x2="20" y2="12.5" />
  </Svg>
);

/* --- water tank: keep / remove / none (empty cupboard) --- */

const TankKeep = ({ size }: IconProps) => (
  <Svg size={size}>
    <line x1="12" y1="2.5" x2="12" y2="4.5" />
    <rect x="8" y="4.5" width="8" height="15.5" rx="4" />
    <line x1="8" y1="9.5" x2="16" y2="9.5" />
  </Svg>
);

const TankRemove = ({ size }: IconProps) => (
  <Svg size={size}>
    <line x1="10" y1="4.5" x2="10" y2="6" />
    <rect x="6" y="6" width="8" height="14" rx="4" />
    <line x1="6" y1="11" x2="14" y2="11" />
    <line x1="16.5" y1="4.5" x2="21" y2="9" />
    <line x1="21" y1="4.5" x2="16.5" y2="9" />
  </Svg>
);

const TankNone = ({ size }: IconProps) => (
  <Svg size={size}>
    <rect x="5" y="4" width="14" height="16" rx="1.2" />
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="10.2" cy="12" r="0.7" />
    <circle cx="13.8" cy="12" r="0.7" />
  </Svg>
);

/* --- property type: one outline style, showing how many neighbours --- */

const PropFlat = ({ size }: IconProps) => (
  <Svg size={size}>
    <rect x="7" y="2.5" width="10" height="19" rx="0.6" />
    <line x1="7" y1="7.5" x2="17" y2="7.5" />
    <line x1="7" y1="12.5" x2="17" y2="12.5" />
    <line x1="7" y1="17.5" x2="17" y2="17.5" />
    <rect x="9" y="8.7" width="6" height="2.6" rx="0.4" fill="currentColor" stroke="none" />
  </Svg>
);

const PropTerraced = ({ size }: IconProps) => (
  <Svg size={size}>
    <path d="M2 12 l3.3 -3 l3.3 3" />
    <path d="M8.7 12 l3.3 -3 l3.3 3" />
    <path d="M15.4 12 l3.3 -3 l3.3 3" />
    <path d="M2 12 V20.5 H22 V12" />
    <line x1="8.6" y1="12" x2="8.6" y2="20.5" />
    <line x1="15.4" y1="12" x2="15.4" y2="20.5" />
    <rect x="10.9" y="15.5" width="2.2" height="5" fill="currentColor" stroke="none" />
  </Svg>
);

const PropSemi = ({ size }: IconProps) => (
  <Svg size={size}>
    <path d="M2 12 l5 -4 l5 4" />
    <path d="M12 12 l5 -4 l5 4" />
    <path d="M3 12 V20.5 H21 V12" />
    <line x1="12" y1="12" x2="12" y2="20.5" />
    <rect x="15.3" y="15" width="2.4" height="5.5" fill="currentColor" stroke="none" />
    <rect x="6" y="15" width="2.4" height="2.4" />
  </Svg>
);

const PropDetached = ({ size }: IconProps) => (
  <Svg size={size}>
    <path d="M4 11 l8 -6.5 l8 6.5" />
    <path d="M6 11 V20.5 H18 V11" />
    <rect x="10.3" y="14.5" width="3.4" height="6" />
    <rect x="7.5" y="13.5" width="2.6" height="2.6" />
    <rect x="13.9" y="13.5" width="2.6" height="2.6" />
  </Svg>
);

const PropBungalow = ({ size }: IconProps) => (
  <Svg size={size}>
    <path d="M3 13 l9 -5.5 l9 5.5" />
    <path d="M5 13 V20.5 H19 V13" />
    <rect x="10.5" y="15.5" width="3" height="5" />
    <rect x="7" y="15" width="2.6" height="2.6" />
    <rect x="14.4" y="15" width="2.6" height="2.6" />
  </Svg>
);

/* --- de-emoji: recommend / flue through roof / flue out the wall --- */

const Recommend = ({ size }: IconProps) => (
  <Svg size={size}>
    <path d="M12 3 a5.5 5.5 0 0 1 3.3 9.9 c-0.7 0.6 -1.1 1.3 -1.3 2.1 h-4 c-0.2 -0.8 -0.6 -1.5 -1.3 -2.1 A5.5 5.5 0 0 1 12 3 Z" />
    <line x1="10" y1="18" x2="14" y2="18" />
    <line x1="10.7" y1="20.5" x2="13.3" y2="20.5" />
  </Svg>
);

const FlueRoof = ({ size }: IconProps) => (
  <Svg size={size}>
    <path d="M3 13 l9 -6.5 l9 6.5" />
    <path d="M5.5 12.2 V20.5 H18.5 V12.2" />
    <line x1="15" y1="9.3" x2="15" y2="3" />
    <path d="M13 5 l2 -2 l2 2" />
  </Svg>
);

const FlueWall = ({ size }: IconProps) => (
  <Svg size={size}>
    <rect x="4" y="4" width="9" height="16" rx="0.6" />
    <line x1="7" y1="8" x2="10" y2="8" />
    <line x1="7" y1="12" x2="10" y2="12" />
    <line x1="7" y1="16" x2="10" y2="16" />
    <line x1="13" y1="12" x2="21" y2="12" />
    <path d="M18.5 9.5 l2.5 2.5 l-2.5 2.5" />
  </Svg>
);

/* --- neutral "none / zero" (a bare X reads as an error on a real answer) --- */

const NoneZero = ({ size }: IconProps) => (
  <Svg size={size}>
    <circle cx="12" cy="12" r="8" />
    <line x1="8.5" y1="12" x2="15.5" y2="12" />
  </Svg>
);

/** keyword → inline SVG icon. Checked before the Tabler keyword map. */
export const OPTION_SVG_MAP: Record<string, (props: IconProps) => JSX.Element> = {
  none: NoneZero,
  'boiler-combi': BoilerCombi,
  'boiler-system': BoilerSystem,
  'boiler-standard': BoilerStandard,
  'tank-keep': TankKeep,
  'tank-remove': TankRemove,
  'tank-none': TankNone,
  'prop-flat': PropFlat,
  'prop-terraced': PropTerraced,
  'prop-semi': PropSemi,
  'prop-detached': PropDetached,
  'prop-bungalow': PropBungalow,
  recommend: Recommend,
  'flue-roof': FlueRoof,
  'flue-wall': FlueWall,
};
