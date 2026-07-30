/**
 * Sveltia rewrites a whole file on save using only the fields declared in
 * config.yml — any key it doesn't know about is silently dropped. So every key
 * in our JSON data files must appear in the CMS config, or Sofiya's first save
 * deletes it.
 *
 * Run: node scripts/check-cms-config.mjs
 */
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const config = parse(readFileSync(new URL('../public/admin/config.yml', import.meta.url), 'utf8'));

/** Field names declared for a given file path in config.yml, keyed by dotted path. */
function declaredPaths(fields, prefix = '') {
  const out = new Set();
  for (const f of fields ?? []) {
    const path = prefix ? `${prefix}.${f.name}` : f.name;
    out.add(path);
    if (f.widget === 'object') for (const p of declaredPaths(f.fields, path)) out.add(p);
    // list-of-objects: children are declared per row, recorded as `path[].child`
    if (f.widget === 'list' && f.fields) for (const p of declaredPaths(f.fields, `${path}[]`)) out.add(p);
  }
  return out;
}

/** Keys actually present in the JSON, in the same dotted notation. */
function actualPaths(value, prefix = '') {
  const out = new Set();
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item && typeof item === 'object') for (const p of actualPaths(item, `${prefix}[]`)) out.add(p);
    }
    return out;
  }
  for (const [k, v] of Object.entries(value ?? {})) {
    const path = prefix ? `${prefix}.${k}` : k;
    out.add(path);
    if (v && typeof v === 'object') for (const p of actualPaths(v, path)) out.add(p);
  }
  return out;
}

const problems = [];
for (const collection of config.collections) {
  for (const entry of collection.files ?? []) {
    if (!entry.file.endsWith('.json')) continue;
    const json = JSON.parse(readFileSync(new URL(`../${entry.file}`, import.meta.url), 'utf8'));
    const declared = declaredPaths(entry.fields);
    for (const path of actualPaths(json)) {
      if (!declared.has(path)) problems.push(`${entry.file}: "${path}" is not declared in config.yml — the CMS would delete it on save`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('CMS config covers every key in every data file.');
