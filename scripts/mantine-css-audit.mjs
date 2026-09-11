#!/usr/bin/env node
/**
 * Mantine per-component CSS audit (RGW-015).
 *
 * `@mantine/core/styles.css` bundles every component's CSS in one file. We
 * switched to importing only the CSS for components actually used (see
 * app/layout.tsx), which is faster but has one real failure mode: import a
 * new `@mantine/core` component somewhere in the app and forget to add its
 * CSS, and it silently renders unstyled — no build error, no type error.
 *
 * This script removes the "forget" step. It:
 *   1. Scans every .ts/.tsx file in the app for `@mantine/core` imports.
 *   2. Resolves each imported name to its compiled module in the installed
 *      @mantine/core package (esm/index.mjs export map).
 *   3. Walks that module's real import graph to find every other Mantine
 *      component it composes internally (e.g. Button -> UnstyledButton,
 *      Loader) — this is exactly the "check the component's source code"
 *      step Mantine's own docs call for, done mechanically instead of by
 *      hand.
 *   4. Maps the full closure to the public `styles/<Component>.css` files
 *      Mantine ships, in a dependency-safe (topological) import order.
 *
 * Run it after adding/removing any `@mantine/core` import anywhere in the
 * app, and diff its output against the per-component CSS block in
 * app/layout.tsx. Mismatch = a call site's styles are about to go missing.
 *
 *   node scripts/mantine-css-audit.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CORE = path.join(REPO_ROOT, 'node_modules/@mantine/core/esm');
const STYLES_DIR = path.join(REPO_ROOT, 'node_modules/@mantine/core/styles');

const SCAN_DIRS = ['app', 'components', 'lib', 'quote-engine', 'sanity', 'test-utils'];
const SCAN_FILES = ['theme.ts'];
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git']);

// ---------------------------------------------------------------------------
// 1. Find every `@mantine/core` import in the app and collect imported names.
// ---------------------------------------------------------------------------
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (IGNORE_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const appFiles = [
  ...SCAN_DIRS.flatMap((d) => walk(path.join(REPO_ROOT, d))),
  ...SCAN_FILES.map((f) => path.join(REPO_ROOT, f)),
].filter((f) => existsSync(f));

const usedNames = new Set();
const importRe = /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'@mantine\/core'/gs;
for (const file of appFiles) {
  const src = readFileSync(file, 'utf-8');
  for (const m of src.matchAll(importRe)) {
    for (const raw of m[1].split(',')) {
      const name = raw
        .trim()
        .split(/\s+as\s+/)[0]
        .trim();
      if (name) usedNames.add(name);
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Resolve each used name to its module file via esm/index.mjs.
// ---------------------------------------------------------------------------
const indexSrc = readFileSync(path.join(CORE, 'index.mjs'), 'utf-8');
const exportMap = new Map();
const exportRe = /export\s*\{([^}]*)\}\s*from\s*'([^']+)'/g;
for (const m of indexSrc.matchAll(exportRe)) {
  const [, namesRaw, relpath] = m;
  for (const raw of namesRaw.split(',')) {
    const part = raw.trim();
    if (!part) continue;
    const [orig, alias] = part.split(/\s+as\s+/).map((s) => s.trim());
    exportMap.set(alias ?? orig, relpath);
  }
}

function resolveModule(relpath, fromDir = CORE) {
  let p = path.normalize(path.join(fromDir, relpath));
  if (!p.endsWith('.mjs')) p += '.mjs';
  return p;
}

const startFiles = [];
const unresolvedNames = [];
for (const name of usedNames) {
  const rel = exportMap.get(name);
  if (!rel) {
    unresolvedNames.push(name);
    continue;
  }
  startFiles.push(resolveModule(rel));
}

// ---------------------------------------------------------------------------
// 3. Walk the real (compiled) import graph to find the full component closure.
// ---------------------------------------------------------------------------
const fromRe = /from\s+['"](\.[^'"]+)['"]/g;
function getImports(absPath) {
  if (!existsSync(absPath)) return [];
  const src = readFileSync(absPath, 'utf-8');
  return [...src.matchAll(fromRe)].map((m) => m[1]);
}

function resolveRelative(baseFile, relImport) {
  let p = path.normalize(path.join(path.dirname(baseFile), relImport));
  if (!p.endsWith('.mjs')) p += '.mjs';
  return p;
}

function closure(starts) {
  const seen = new Set();
  const queue = [...starts];
  while (queue.length) {
    const f = queue.pop();
    if (seen.has(f) || !existsSync(f)) continue;
    seen.add(f);
    for (const rel of getImports(f)) queue.push(resolveRelative(f, rel));
  }
  return seen;
}

const allReachable = closure(startFiles);

// ---------------------------------------------------------------------------
// 4. Map each reachable file to the top-level component that owns its CSS
//    module (sub-parts like AccordionItem share Accordion's CSS file).
// ---------------------------------------------------------------------------
const componentsRoot = path.join(CORE, 'components');
const coreRoot = path.join(CORE, 'core');

function owningCssComponent(absPath) {
  let dir = path.dirname(absPath);
  for (;;) {
    const base = path.basename(dir);
    if (existsSync(path.join(dir, `${base}.module.css.mjs`))) return base;
    const parent = path.dirname(dir);
    if (parent === dir || !(dir.startsWith(componentsRoot) || dir.startsWith(coreRoot))) {
      return null;
    }
    dir = parent;
  }
}

const available = new Set(
  readdirSync(STYLES_DIR)
    .filter((f) => f.endsWith('.css') && !f.endsWith('.layer.css'))
    .map((f) => f.replace(/\.css$/, ''))
);

const fileOwner = new Map();
for (const f of allReachable) {
  if (!f.startsWith(componentsRoot) && !f.startsWith(coreRoot)) continue;
  const owner = owningCssComponent(f);
  if (owner) fileOwner.set(f, owner);
}

const cssComponents = new Set(fileOwner.values());
const resolved = [...cssComponents].filter((c) => available.has(c)).sort();
const unresolved = [...cssComponents].filter((c) => !available.has(c)).sort();

// ---------------------------------------------------------------------------
// 5. Topologically sort so dependencies are imported before their dependents.
// ---------------------------------------------------------------------------
const edges = new Map(); // component -> Set(components it depends on)
for (const [file, owner] of fileOwner) {
  for (const rel of getImports(file)) {
    const other = fileOwner.get(resolveRelative(file, rel));
    if (other && other !== owner) {
      if (!edges.has(owner)) edges.set(owner, new Set());
      edges.get(owner).add(other);
    }
  }
}

const nodes = new Set(resolved);
const order = [];
const state = new Map();
function visit(n) {
  if (state.get(n) === 'done' || state.get(n) === 'visiting') return;
  state.set(n, 'visiting');
  for (const dep of [...(edges.get(n) ?? [])].filter((d) => nodes.has(d)).sort()) {
    visit(dep);
  }
  state.set(n, 'done');
  order.push(n);
}
for (const n of [...nodes].sort()) visit(n);

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------
console.log(
  `Scanned ${appFiles.length} files, found ${usedNames.size} unique @mantine/core imports.`
);
if (unresolvedNames.length) {
  console.log(
    `\nWARNING - imported names not found in @mantine/core's export map (typo, or not a component):`
  );
  for (const n of unresolvedNames) console.log(`  ${n}`);
}
if (unresolved.length) {
  console.log(`\nWARNING - components in the dependency closure with no public styles/ file:`);
  for (const c of unresolved) console.log(`  ${c}`);
}

console.log(`\nRequired base imports (always, in this order):`);
console.log(`  import '@mantine/core/styles/baseline.css';`);
console.log(`  import '@mantine/core/styles/default-css-variables.css';`);
console.log(`  import '@mantine/core/styles/global.css';`);

console.log(`\nRequired per-component imports (${order.length}), dependency-safe order:`);
for (const c of order) {
  console.log(`  import '@mantine/core/styles/${c}.css';`);
}
