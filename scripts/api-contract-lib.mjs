// Shared helpers for gen-api.mjs and check-api.mjs (FE0 T-FE0.1).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export const SNAPSHOT_PATH = 'src/lib/api/generated/openapi.json';
export const SCHEMA_PATH = 'src/lib/api/generated/schema.d.ts';
export const LOCK_PATH = 'api-contract.lock';
export const DEFAULT_OPENAPI_URL = 'http://localhost:8080/openapi.json';

/** Deep-sort object keys so the hash does not depend on serializer order. */
export function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, normalize(value[k])]),
    );
  }
  return value;
}

export function canonical(spec) {
  return JSON.stringify(normalize(spec), null, 1) + '\n';
}

export function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

/** Load a spec from a URL (fetch) or a local file path. */
export async function loadSpec(source) {
  if (/^https?:\/\//.test(source)) {
    const res = await fetch(source, { headers: { accept: 'application/json' } });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !type.includes('json')) {
      throw new Error(`${source} answered ${res.status} ${type || '(no content-type)'} — not an OpenAPI document`);
    }
    return res.json();
  }
  return JSON.parse(readFileSync(source, 'utf8'));
}

export function readLock() {
  try {
    return JSON.parse(readFileSync(LOCK_PATH, 'utf8'));
  } catch {
    return null;
  }
}

/** Human-readable delta between two specs: paths and component schemas. */
export function describeDrift(before, after) {
  const lines = [];
  const bp = new Set(Object.keys(before.paths ?? {}));
  const ap = new Set(Object.keys(after.paths ?? {}));
  for (const p of ap) if (!bp.has(p)) lines.push(`+ path ${p}`);
  for (const p of bp) if (!ap.has(p)) lines.push(`- path ${p}`);
  for (const p of ap) {
    if (!bp.has(p)) continue;
    if (JSON.stringify(normalize(before.paths[p])) !== JSON.stringify(normalize(after.paths[p]))) {
      lines.push(`~ path ${p}`);
    }
  }
  const bs = before.components?.schemas ?? {};
  const as = after.components?.schemas ?? {};
  for (const s of Object.keys(as)) if (!(s in bs)) lines.push(`+ schema ${s}`);
  for (const s of Object.keys(bs)) if (!(s in as)) lines.push(`- schema ${s}`);
  for (const s of Object.keys(as)) {
    if (!(s in bs)) continue;
    const b = normalize(bs[s]);
    const a = normalize(as[s]);
    if (JSON.stringify(b) !== JSON.stringify(a)) {
      const bprops = Object.keys(b.properties ?? {});
      const aprops = Object.keys(a.properties ?? {});
      const added = aprops.filter((k) => !bprops.includes(k));
      const removed = bprops.filter((k) => !aprops.includes(k));
      const changed = aprops.filter(
        (k) => bprops.includes(k) && JSON.stringify(b.properties[k]) !== JSON.stringify(a.properties[k]),
      );
      const bits = [];
      if (added.length) bits.push(`+${added.join(',')}`);
      if (removed.length) bits.push(`-${removed.join(',')}`);
      if (changed.length) bits.push(`~${changed.join(',')}`);
      lines.push(`~ schema ${s}${bits.length ? ` (${bits.join(' ')})` : ''}`);
    }
  }
  return lines;
}
