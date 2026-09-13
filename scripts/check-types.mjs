#!/usr/bin/env node
// `npm run check:types` — F0 cut list §6, guard rail 3: "CI fails on a
// hand-written type that shadows a generated one."
//
// A response type written by hand next to a contract component is a duplicate,
// and duplicates are how the UI silently lies: the server changes a field, the
// generated schema follows, and the hand-written twin keeps the old promise.
//
// Two checks over the owner-app scope:
//
//   1. NAME SHADOW — a declaration named after a component in
//      generated/schema.d.ts must BE that component (`= Wire<"X">` or
//      `components["schemas"]["X"]`), not a fresh interface.
//   2. STRUCTURAL SHADOW — a declaration whose property names are exactly some
//      component's property names is that component under another name. This
//      is the one that catches `ThreadWire` vs `ThreadOut`.
//
// Two kinds of type are allowed to differ and stay hand-written:
//   * a VIEW MODEL, which renames or defaults wire fields for the owner UI; and
//   * a REQUEST body the FE deliberately holds to a stricter shape than the
//     contract does (sending more than the server demands is safe; promising
//     more than the server sends is not).
// Tag either with `@derives <Component>` in its doc comment, and say why on the
// next line — the tag is what a reviewer reads to tell a decision from a drift.
//
//   npm run check:types            # exits 1 on any shadow
//   npm run check:types -- --summary   # also appends to $GITHUB_STEP_SUMMARY
import { appendFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/lib/api', 'src/pages/telephony', 'src/components/voice'];
const SCHEMA = 'src/lib/api/generated/openapi.json';

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === 'node_modules' || name === 'generated' || name === '__tests__') continue;
      walk(full, out);
    } else if (/\.tsx?$/.test(name) && !/\.(test|spec)\.tsx?$/.test(name)) {
      out.push(full);
    }
  }
  return out;
};

const schemas = JSON.parse(readFileSync(SCHEMA, 'utf8')).components?.schemas ?? {};
/** component name → sorted property names, for the structural check. */
const byShape = new Map();
for (const [name, def] of Object.entries(schemas)) {
  const props = Object.keys(def.properties ?? {});
  if (props.length < 3) continue; // too small to identify anything
  byShape.set(props.slice().sort().join('|'), name);
}

const files = ROOTS.flatMap((r) => walk(r));
const problems = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lines = src.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const m = /^\s*(?:export\s+)?interface\s+(\w+)/.exec(lines[i]);
    if (!m) continue;
    const name = m[1];

    // The doc comment immediately above decides whether this is a view model.
    let doc = '';
    for (let j = i - 1; j >= 0 && j > i - 30; j--) {
      doc = lines[j] + '\n' + doc;
      if (/\/\*\*/.test(lines[j])) break;
      if (!/^\s*(\*|\/\*)/.test(lines[j])) { doc = ''; break; }
    }
    const viewmodel = /@derives\s+(\w+)/.exec(doc);
    if (viewmodel) {
      if (!schemas[viewmodel[1]]) {
        problems.push(`${file}:${i + 1}  ${name} is tagged @derives ${viewmodel[1]}, but no such component exists in the contract`);
      }
      continue;
    }

    if (schemas[name]) {
      problems.push(`${file}:${i + 1}  ${name} shadows contract component "${name}" — alias it as \`export type ${name} = Wire<"${name}">\`, or tag it \`@derives ${name}\` if it deliberately differs`);
      continue;
    }

    // Collect this interface's own property names for the structural check.
    const props = [];
    let depth = 0;
    for (let j = i; j < lines.length; j++) {
      depth += (lines[j].match(/\{/g) ?? []).length - (lines[j].match(/\}/g) ?? []).length;
      if (j > i && depth <= 0) break;
      const pm = /^\s*(\w+)\??\s*:/.exec(lines[j]);
      if (pm && depth === 1) props.push(pm[1]);
    }
    if (props.length < 3) continue;
    const hit = byShape.get(props.slice().sort().join('|'));
    if (hit) {
      problems.push(`${file}:${i + 1}  ${name} has exactly the fields of contract component "${hit}" — alias it as \`type ${name} = Wire<"${hit}">\`, or tag it \`@derives ${hit}\``);
    }
  }
}

const summary = problems.length
  ? `**check:types** — ${problems.length} hand-written type(s) shadow the contract\n\n${problems.map((p) => `- ${p}`).join('\n')}`
  : `**check:types** — no hand-written type shadows the contract (${files.length} files, ${Object.keys(schemas).length} components)`;

if (process.argv.includes('--summary') && process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
}

if (problems.length) {
  console.error(`check:types — ${problems.length} hand-written type(s) shadow the contract:\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nSee docs/frontend-audit.md §5 item 3.');
  process.exit(1);
}
console.log(`check:types — clean (${files.length} files against ${Object.keys(schemas).length} contract components)`);
