#!/usr/bin/env node
/**
 * Generates the branded 1200×630 Open Graph images committed to public/og/
 * (referenced from lib/og.ts). Static PNGs keep the production build fast —
 * no per-request image rendering.
 *
 * Usage: node scripts/generate-og.mjs
 *
 * Needs node_modules (uses sharp) and, on the first run, network access to
 * download the Manrope font into node_modules/.cache/og-fonts. If the font
 * can't be fetched it falls back to whatever bold sans-serif fontconfig
 * finds — re-run with network before shipping in that case.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fontsDir = path.join(root, 'node_modules', '.cache', 'og-fonts');
const outDir = path.join(root, 'public', 'og');

// Google Fonts upstream (OFL licence). Variable font — weights 200–800.
const MANROPE_URL =
  'https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/Manrope%5Bwght%5D.ttf';

const BLUE = '#0869D1';
const BLUE_DARK = '#04366E';
const ORANGE = '#FE7E04';

async function ensureFonts() {
  await mkdir(fontsDir, { recursive: true });
  const fontPath = path.join(fontsDir, 'Manrope.ttf');
  if (!existsSync(fontPath)) {
    try {
      const res = await fetch(MANROPE_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(fontPath, Buffer.from(await res.arrayBuffer()));
      console.log('Downloaded Manrope to', fontPath);
    } catch (err) {
      console.warn(`WARNING: could not download Manrope (${err.message}); using fallback font.`);
    }
  }
  const confPath = path.join(fontsDir, 'fonts.conf');
  await writeFile(
    confPath,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${fontsDir}</dir>
  <cachedir>${path.join(fontsDir, 'cache')}</cachedir>
</fontconfig>
`
  );
  // Must be set before sharp/libvips loads so librsvg's fontconfig sees it.
  process.env.FONTCONFIG_FILE = confPath;
  process.env.FONTCONFIG_PATH = fontsDir;
}

/** Inner markup of the white wordmark logo (viewBox 0 0 1920 320). */
async function loadLogoMarkup() {
  const svg = await readFile(
    path.join(root, 'public', 'images', 'logo', 'logo-white.svg'),
    'utf8'
  );
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function card({ logo, kicker, headline, sub }) {
  const headlineY = 330;
  const lineHeight = 82;
  const lines = headline
    .map(
      (line, i) =>
        `<text x="80" y="${headlineY + i * lineHeight}" font-family="Manrope, DejaVu Sans, sans-serif" font-weight="800" font-size="66" fill="#ffffff">${esc(line)}</text>`
    )
    .join('\n  ');
  const kickerEl = kicker
    ? `<text x="80" y="248" font-family="Manrope, DejaVu Sans, sans-serif" font-weight="800" font-size="26" letter-spacing="4" fill="${ORANGE}">${esc(kicker.toUpperCase())}</text>`
    : `<rect x="80" y="226" width="96" height="10" rx="5" fill="${ORANGE}"/>`;

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BLUE}"/>
      <stop offset="1" stop-color="${BLUE_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <!-- decorative arcs, bottom-right -->
  <circle cx="1150" cy="620" r="330" fill="none" stroke="${ORANGE}" stroke-opacity="0.9" stroke-width="3"/>
  <circle cx="1150" cy="620" r="255" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
  <circle cx="1150" cy="620" r="180" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="2"/>
  <!-- wordmark, top-left -->
  <g transform="translate(76 56) scale(0.2)">${logo}</g>
  ${kickerEl}
  ${lines}
  <text x="80" y="${headlineY + headline.length * lineHeight - 20}" font-family="Manrope, DejaVu Sans, sans-serif" font-weight="700" font-size="30" fill="#ffffff" fill-opacity="0.88">${esc(sub)}</text>
  <!-- footer strip -->
  <rect x="0" y="546" width="1200" height="84" fill="#000000" fill-opacity="0.18"/>
  <text x="80" y="598" font-family="Manrope, DejaVu Sans, sans-serif" font-weight="800" font-size="28" fill="#ffffff">rgwplumbing.co.uk</text>
  <text x="380" y="598" font-family="Manrope, DejaVu Sans, sans-serif" font-weight="700" font-size="24" fill="#ffffff" fill-opacity="0.75">Gas Safe registered ${'·'} 24-hour emergency cover</text>
</svg>`;
}

const cards = {
  'default.png': {
    headline: ['Heating & plumbing,', 'done properly.'],
    sub: 'Gas Safe engineers covering Eastleigh, Winchester & South Hampshire',
  },
  'quote.png': {
    kicker: 'Free instant quote',
    headline: ['Your new boiler price,', 'in about a minute.'],
    sub: 'Six quick questions · No obligation · Free survey to confirm',
  },
  'help-and-advice.png': {
    kicker: 'Help & advice',
    headline: ['Straight answers on', 'boilers, heating & plumbing.'],
    sub: 'Practical guides from the engineers at RGW',
  },
};

async function main() {
  await ensureFonts();
  const { default: sharp } = await import('sharp');
  const logo = await loadLogoMarkup();
  await mkdir(outDir, { recursive: true });
  for (const [file, spec] of Object.entries(cards)) {
    const svg = card({ logo, ...spec });
    const out = path.join(outDir, file);
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
    console.log('Wrote', out);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
