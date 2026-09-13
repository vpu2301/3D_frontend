#!/usr/bin/env node
// `npm run count-mocks` — Block I rule 1: the number of badged (mock) surfaces
// may only go down per sprint and must be 0 at FE10.
//
// Counts, in src/**/*.tsx (tests and the badge components' own files excluded):
//   every usage of <MockedSection>, <MockedRouteBanner>, <MockedBadge>,
//   <SprintBadge> and any literal `data-mock=` attribute.
//   Wrapper components are counted where they are *used*, so a wrapper never
//   hides a badge. That is the source-level inventory; the DOM-level pin for
//   the Voice page lives in src/test/voice/mockInventory.test.ts.
//
//   npm run count-mocks             # prints the count, fails if > mock-count.lock
//   npm run count-mocks -- --update # rewrites mock-count.lock (a de-mocking PR)
//   npm run count-mocks -- --summary  # also appends to $GITHUB_STEP_SUMMARY
import { appendFileSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const LOCK = 'mock-count.lock';
// FE10: the owner/voice app is the gated scope; the platform's own demo sections (Dashboard, Brain, Tasks) are outside it.
const ROOTS = ['src/pages/telephony', 'src/components/voice'];
const EXCLUDE = new Set([
  'src/components/voice/MockedBadge.tsx',
  'src/pages/telephony/_components/owner/SprintBadge.tsx',
]);
const PATTERNS = [/<MockedSection\b/g, /<MockedRouteBanner\b/g, /<MockedBadge\b/g, /<SprintBadge\b/g, /\bdata-mock=/g];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'test' || name === '__tests__') continue;
      walk(full, out);
    } else if (/\.tsx$/.test(name) && !/\.(test|spec)\.tsx$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

const perFile = [];
let total = 0;
for (const file of ROOTS.flatMap((r) => walk(r))) {
  const rel = relative('.', file);
  if (EXCLUDE.has(rel)) continue;
  const src = readFileSync(file, 'utf8');
  let n = 0;
  for (const re of PATTERNS) n += (src.match(re) ?? []).length;
  if (n > 0) {
    perFile.push([rel, n]);
    total += n;
  }
}
perFile.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

const args = process.argv.slice(2);
let baseline = null;
try {
  baseline = JSON.parse(readFileSync(LOCK, 'utf8')).count;
} catch {
  /* no lock yet */
}

const table = perFile.map(([f, n]) => `  ${String(n).padStart(3)}  ${f}`).join('\n');
console.log(`mock surfaces: ${total}${baseline === null ? '' : ` (lock: ${baseline})`}\n${table}`);

if (args.includes('--summary') && process.env.GITHUB_STEP_SUMMARY) {
  const md = [
    `### Mock badges: **${total}**${baseline === null ? '' : ` (baseline ${baseline})`}`,
    '',
    '| Count | File |',
    '|---:|---|',
    ...perFile.map(([f, n]) => `| ${n} | \`${f}\` |`),
    '',
  ].join('\n');
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
}

if (args.includes('--update')) {
  writeFileSync(LOCK, JSON.stringify({ count: total, updated_at: new Date().toISOString() }, null, 2) + '\n');
  console.log(`count-mocks: ${LOCK} ← ${total}`);
  process.exit(0);
}

if (total > 0 && baseline === 0) {
  console.error(`count-mocks ✗ ${total} > 0: FE10 gate — every owner-app surface is real or hidden behind a capability flag (src/content/not-yet.ts).`);
  process.exit(1);
}
if (baseline !== null && total > baseline) {
  console.error(`count-mocks ✗ ${total} > ${baseline}: a new badge appeared. Ship the real surface or record why in ${LOCK} (--update) in the same PR.`);
  process.exit(1);
}
if (baseline !== null && total < baseline) {
  console.log(`count-mocks: ${total} < ${baseline} — run with --update to lower the baseline.`);
}
