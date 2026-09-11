import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * RGW-080: article cover and inline images are Sanity assets on cdn.sanity.io
 * rendered through next/image, which refuses any remote host not listed in
 * images.remotePatterns. Guards the config entry so it cannot be dropped
 * silently; the Sanity client itself is ESM-only and not importable here.
 */
describe('next/image remote patterns (RGW-080)', () => {
  const config = readFileSync(join(__dirname, '..', '..', 'next.config.mjs'), 'utf8');
  const imagesBlock = config.slice(config.indexOf('images: {'));

  it('allows cdn.sanity.io under this project asset path', () => {
    expect(imagesBlock).toMatch(/remotePatterns:\s*\[/);
    expect(imagesBlock).toContain("protocol: 'https'");
    expect(imagesBlock).toContain("hostname: 'cdn.sanity.io'");
    expect(imagesBlock).toMatch(
      /pathname: `\/images\/\$\{process\.env\.NEXT_PUBLIC_SANITY_PROJECT_ID/
    );
  });
});
