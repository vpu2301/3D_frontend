#!/usr/bin/env node
// FE0 T-FE0.4 bundle budget: report gzipped sizes of the built chunks.
//
// Gated: the owner app's own route chunk (TelephonyHome-*.js) ≤ 250 KB gz.
// Reported only: the platform entry (index-*.js), which every route pays for
// and which the owner app does not own — App.tsx imports ~150 marketing and
// platform pages eagerly. Bringing that under budget is a platform task
// recorded in docs/app/FE0-audit.md §1 (deployment/bundle).
import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const DIR = 'dist/assets';
const BUDGET_KB = 250;
const args = process.argv.slice(2);

const files = readdirSync(DIR)
  .filter((f) => f.endsWith('.js'))
  .map((f) => {
    const buf = readFileSync(join(DIR, f));
    return { file: f, raw: statSync(join(DIR, f)).size, gz: gzipSync(buf).length };
  })
  .sort((a, b) => b.gz - a.gz);

const kb = (n) => (n / 1024).toFixed(1);
const owner = files.filter((f) => /^TelephonyHome-/.test(f.file));
const platform = files.filter((f) => /^index-/.test(f.file));
const entryGz = owner.reduce((s, f) => s + f.gz, 0);
const platformGz = platform.reduce((s, f) => s + f.gz, 0);

console.log(`top chunks (gz):\n${files.slice(0, 12).map((f) => `  ${kb(f.gz).padStart(7)} KB  ${f.file}`).join('\n')}`);
console.log(`owner-app chunk: ${kb(entryGz)} KB gz (budget ${BUDGET_KB} KB) — ${owner.map((f) => f.file).join(' + ')}`);
console.log(`platform entry (not gated, see audit): ${kb(platformGz)} KB gz — ${platform.map((f) => f.file).join(' + ')}`);

if (args.includes('--summary') && process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Bundle: owner-app chunk **${kb(entryGz)} KB gz** (budget ${BUDGET_KB} KB) · platform entry ${kb(platformGz)} KB gz (not gated)\n\n| gz KB | chunk |\n|---:|---|\n${files
      .slice(0, 12)
      .map((f) => `| ${kb(f.gz)} | \`${f.file}\` |`)
      .join('\n')}\n`,
  );
}
if (entryGz > BUDGET_KB * 1024) {
  console.error(`bundle ✗ ${kb(entryGz)} KB gz > ${BUDGET_KB} KB`);
  process.exit(1);
}
