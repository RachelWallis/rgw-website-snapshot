/**
 * Tiny builder for Sanity Portable Text blocks, matching the shape the
 * `article.body` field (sanity/schemas/article.ts) and the article page's
 * PortableText renderer (lib/portableTextComponents.tsx) expect: an array
 * of `block` documents with `_type`, `_key`, `style`, and `children` spans.
 *
 * Content is authored here as plain data (heading/paragraph/list/link
 * helpers) rather than hand-written Portable Text JSON, so drafts stay
 * readable and every block gets a valid, unique `_key` without doing it
 * by hand.
 */

export type PortableSpan = {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
};

export type PortableLinkMarkDef = {
  _type: 'link';
  _key: string;
  href: string;
};

export type PortableBlock = {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h2' | 'h3';
  listItem?: 'bullet' | 'number';
  level?: number;
  markDefs: PortableLinkMarkDef[];
  children: PortableSpan[];
};

let keyCounter = 0;
function nextKey(prefix: string): string {
  keyCounter += 1;
  return `${prefix}-${keyCounter}`;
}

function span(text: string, marks: string[] = []): PortableSpan {
  return { _type: 'span', _key: nextKey('span'), text, marks };
}

function block(
  style: PortableBlock['style'],
  children: PortableSpan[],
  markDefs: PortableLinkMarkDef[] = [],
  extra: Partial<PortableBlock> = {}
): PortableBlock {
  return {
    _type: 'block',
    _key: nextKey('block'),
    style,
    markDefs,
    children,
    ...extra,
  };
}

/** H2 section heading. */
export function h2(text: string): PortableBlock {
  return block('h2', [span(text)]);
}

/** H3 sub-heading. */
export function h3(text: string): PortableBlock {
  return block('h3', [span(text)]);
}

/** A normal body paragraph. */
export function p(text: string): PortableBlock {
  return block('normal', [span(text)]);
}

/**
 * A paragraph with one inline link in the middle, for real internal links
 * between articles (or out to a service page) rather than unlinked text
 * naming another page.
 */
export function pLink(before: string, linkText: string, href: string, after = ''): PortableBlock {
  const markKey = nextKey('link');
  const children = [span(before), span(linkText, [markKey])];
  if (after) {
    children.push(span(after));
  }
  return block('normal', children, [{ _type: 'link', _key: markKey, href }]);
}

/** A bulleted list, one block per item. */
export function bullets(items: string[]): PortableBlock[] {
  return items.map((item) => block('normal', [span(item)], [], { listItem: 'bullet', level: 1 }));
}

/** A numbered list, one block per item. */
export function numbered(items: string[]): PortableBlock[] {
  return items.map((item) => block('normal', [span(item)], [], { listItem: 'number', level: 1 }));
}
