#!/usr/bin/env -S node_modules/.bin/tsx
/**
 * Publishes the drafted Help & Advice articles in content/help-articles/
 * into Sanity. RGW-017 drafted these locally because this environment has
 * no NEXT_PUBLIC_SANITY_PROJECT_ID configured (no way to read or write the
 * live dataset from here) — this script is how anyone with real Sanity
 * credentials turns the drafts into published documents.
 *
 * Usage:
 *   SANITY_API_TOKEN=<write token> \
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=<project id> \
 *   NEXT_PUBLIC_SANITY_DATASET=<dataset, default "production"> \
 *   node_modules/.bin/tsx scripts/import-help-articles.ts [--dry-run]
 *
 * The token needs write access (Editor role or above) in the Sanity
 * project's API settings. Get it from sanity.io/manage, never commit it.
 *
 * Each article is upserted (createOrReplace) under a deterministic
 * `article-<slug>` document id, so re-running this after an edit updates
 * the same document rather than creating a duplicate. This REPLACES
 * anything already published at that id, including any hand-edits made
 * in Studio, so check the dataset first if these slugs might already
 * exist there.
 */
import { createClient } from '@sanity/client';
import { helpArticleDrafts } from '../content/help-articles';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_API_TOKEN;
const dryRun = process.argv.includes('--dry-run');

if (!projectId) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Nothing to publish to.');
  process.exit(1);
}
if (!token && !dryRun) {
  console.error('SANITY_API_TOKEN is not set. Pass --dry-run to preview without one.');
  process.exit(1);
}

async function main() {
  console.log(`Project: ${projectId}, dataset: ${dataset}${dryRun ? ' (dry run)' : ''}`);

  const client = dryRun
    ? null
    : createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false });

  for (const draft of helpArticleDrafts) {
    const id = `article-${draft.slug}`;
    const doc = {
      _id: id,
      _type: 'article',
      title: draft.title,
      slug: { _type: 'slug', current: draft.slug },
      publishedAt: new Date().toISOString(),
      excerpt: draft.excerpt,
      body: draft.body,
    };

    if (dryRun) {
      const wordCount = draft.body
        .flatMap((block) =>
          typeof block === 'object' && block !== null && 'children' in block
            ? (block as { children: { text: string }[] }).children.map((c) => c.text)
            : []
        )
        .join(' ')
        .split(/\s+/)
        .filter(Boolean).length;
      console.log(`[dry run] Would publish "${draft.title}" (${id}), ~${wordCount} words.`);
      continue;
    }

    // Publishing sequentially, on purpose: easy to read in the console log.
    await client!.createOrReplace(doc);
    console.log(`Published "${draft.title}" as ${id}.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
