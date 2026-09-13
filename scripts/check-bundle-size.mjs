// `npm run check:bundle` — FE10 §1 performance budget: the owner app's initial JS
// (entry chunk + the lazy TelephonyHome chunk and its static imports) ≤ 250 KB gzipped.
// Run after `vite build`. Prints the ten largest chunks so regressions are visible.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB ?? 250);
const dir = 'dist/assets';
let files;
try {
  files = readdirSync(dir).filter((f) => f.endsWith('.js'));
} catch {
  console.error('check:bundle ✗ dist/assets missing — run vite build first');
  process.exit(1);
}
const gz = (f) => gzipSync(readFileSync(join(dir, f)), { level: 9 }).length;
const sizes = files.map((f) => ({ f, raw: statSync(join(dir, f)).size, gz: gz(f) })).sort((a, b) => b.gz - a.gz);
const html = readFileSync('dist/index.html', 'utf8');
const entry = sizes.filter((s) => html.includes(`/assets/${s.f}`));
const home = sizes.filter((s) => /^TelephonyHome-/.test(s.f));
// transitive static imports of the home chunk: `from"./x.js"` / `import"./x.js"` (dynamic `import("./x.js")` is a lazy route chunk and excluded)
const esc = (f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const staticDeps = (file, seen = new Set()) => {
  const src = readFileSync(join(dir, file), 'utf8');
  for (const s of sizes) {
    if (seen.has(s.f) || s.f === file) continue;
    if (new RegExp(`(from|import)"\\./${esc(s.f)}"`).test(src)) {
      seen.add(s.f);
      staticDeps(s.f, seen);
    }
  }
  return seen;
};
const staticImports = sizes.filter((s) => home.some((h) => staticDeps(h.f).has(s.f)) && !home.includes(s));
// The platform shell (entry) loads before the owner app and is measured separately: it is the
// platform's eager route imports (FE0 audit §5), not owner-app code.
const ownerImports = staticImports.filter((s) => !entry.includes(s));
const ownerKb = [...home, ...ownerImports].reduce((n, s) => n + s.gz, 0) / 1024;
const entryKb = entry.reduce((n, s) => n + s.gz, 0) / 1024;
console.log('largest chunks (gz):');
for (const s of sizes.slice(0, 10)) console.log(`  ${(s.gz / 1024).toFixed(1).padStart(7)} KB  ${s.f}`);
console.log(`platform entry: ${entryKb.toFixed(1)} KB gz (${entry.map((s) => s.f).join(', ')})`);
console.log(`owner app initial JS: home ${home.map((s) => `${s.f} ${(s.gz / 1024).toFixed(1)} KB`).join(', ')} + ${ownerImports.length} shared chunks (${ownerImports.map((s) => `${s.f} ${(s.gz / 1024).toFixed(1)} KB`).join(', ')}) = ${ownerKb.toFixed(1)} KB gz`);
console.log(`first paint of /telephony: ${(entryKb + ownerKb).toFixed(1)} KB gz including the platform shell`);
if (ownerKb > BUDGET_KB) {
  console.error(`check:bundle ✗ owner app ${ownerKb.toFixed(1)} KB gz > ${BUDGET_KB} KB`);
  process.exit(1);
}
console.log(`check:bundle ✓ owner app ${ownerKb.toFixed(1)} KB gz ≤ ${BUDGET_KB} KB`);
