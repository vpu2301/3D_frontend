#!/usr/bin/env node
// `npm run check:api` — fails when the committed contract is stale or when the
// backend has drifted from it (FE-ADR-002, R11).
//
// Three checks, in order:
//   1. api-contract.lock's hash matches the committed snapshot (nobody edited
//      the snapshot by hand or forgot to run gen:api after changing it).
//   2. schema.d.ts is exactly what openapi-typescript produces from the
//      snapshot (nobody hand-patched a generated type).
//   3. If a live spec is reachable — PINCER_OPENAPI_URL, --from <file>, or the
//      default localhost URL — its hash matches the lock. A mismatch prints the
//      path/schema delta and exits 1. Unreachable is a warning, not a failure:
//      CI produces the spec from the pinned backend commit and passes it with
//      --from, so the offline case is the developer's laptop, not the gate.
import { readFileSync } from 'node:fs';
import openapiTS, { astToString } from 'openapi-typescript';
import {
  DEFAULT_OPENAPI_URL,
  LOCK_PATH,
  SCHEMA_PATH,
  SNAPSHOT_PATH,
  canonical,
  describeDrift,
  loadSpec,
  readLock,
  sha256,
} from './api-contract-lib.mjs';

const args = process.argv.slice(2);
const fromIdx = args.indexOf('--from');
const explicitSource = fromIdx >= 0 ? args[fromIdx + 1] : process.env.PINCER_OPENAPI_URL;
const strict = args.includes('--strict') || Boolean(explicitSource);

const lock = readLock();
if (!lock) {
  console.error(`check:api ✗ ${LOCK_PATH} missing — run npm run gen:api`);
  process.exit(1);
}

const snapshotText = readFileSync(SNAPSHOT_PATH, 'utf8');
const snapshot = JSON.parse(snapshotText);
const failures = [];

// 1. lock ↔ snapshot
const snapshotHash = sha256(canonical(snapshot));
if (snapshotHash !== lock.spec_sha256) {
  failures.push(`lock hash ${lock.spec_sha256.slice(0, 12)} ≠ snapshot ${snapshotHash.slice(0, 12)} — run npm run gen:api`);
}

// 2. snapshot ↔ generated types (compare body below the banner)
const ast = await openapiTS(snapshot, { alphabetize: true, defaultNonNullable: false });
const expectedBody = astToString(ast).trim();
const committed = readFileSync(SCHEMA_PATH, 'utf8');
const committedBody = committed.slice(committed.indexOf('export ')).trim();
if (committedBody !== expectedBody) {
  failures.push(`${SCHEMA_PATH} is not what the snapshot generates — run npm run gen:api (never edit it by hand)`);
}

// 3. live ↔ lock
const source = explicitSource ?? DEFAULT_OPENAPI_URL;
let live = null;
try {
  live = await loadSpec(source);
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  if (strict) failures.push(`could not load ${source}: ${msg}`);
  else console.warn(`check:api: backend not reachable at ${source} (${msg.split('\n')[0]}) — drift check skipped`);
}
if (live) {
  const liveHash = sha256(canonical(live));
  if (liveHash !== lock.spec_sha256) {
    const delta = describeDrift(snapshot, live);
    failures.push(
      `backend contract drifted from ${LOCK_PATH} (pincer ${String(lock.pincer_commit).slice(0, 12)}):\n  ` +
        (delta.length ? delta.join('\n  ') : '(same paths and schemas, different metadata)') +
        '\n  → run npm run gen:api and review the type changes, then bump pincer_commit',
    );
  } else {
    console.log(`check:api ✓ live spec at ${source} matches the lock`);
  }
}

if (failures.length) {
  console.error('check:api ✗\n' + failures.map((f) => `- ${f}`).join('\n'));
  process.exit(1);
}
console.log(`check:api ✓ contract pinned to pincer ${String(lock.pincer_commit).slice(0, 12)} (${lock.paths} paths)`);
