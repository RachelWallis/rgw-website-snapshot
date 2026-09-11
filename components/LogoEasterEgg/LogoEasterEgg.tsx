'use client';

import { useRef, useState, type ReactNode } from 'react';
import classes from './LogoEasterEgg.module.css';

const CLICKS_NEEDED = 5;
const CLICK_WINDOW_MS = 1200;
const MESSAGES = [
  '🔥 Found it. Rich says hi.',
  "🔥 You've got too much time on your hands, we like that.",
  '🔥 Not every hero wears a cape. Some just fix boilers.',
];

type Props = { children: ReactNode };

/** Click the flame N times fast, a hidden, harmless bit of fun. Only wired up on the homepage hero logo, where clicking doesn't navigate anywhere (it's already "/"). */
export function LogoEasterEgg({ children }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const clickCount = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleClick() {
    clickCount.current += 1;
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, CLICK_WINDOW_MS);

    if (clickCount.current >= CLICKS_NEEDED) {
      clickCount.current = 0;
      clearTimeout(resetTimer.current);
      clearTimeout(hideTimer.current);
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      hideTimer.current = setTimeout(() => setMessage(null), 4000);
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- decorative easter egg, deliberately not a real control (no keyboard/ARIA affordance so it isn't announced as an interactive element)
    <span className={classes.wrap} onClick={handleClick}>
      {children}
      {message && (
        <span key={message} className={classes.bubble}>
          {message}
        </span>
      )}
    </span>
  );
}
