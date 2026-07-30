/**
 * No CMS save should ever be able to fail the production build.
 *
 * Feeds every collection schema the shapes a bad save can actually produce —
 * empty object, nulls, wrong types, out-of-range numbers, unknown enum values —
 * and asserts none of them throw. A throw here means Sofiya could save
 * something that breaks the deploy without any visible error.
 *
 * Run: node scripts/check-schema-resilience.mjs
 */
import assert from 'node:assert';
import { allSchemas } from '../src/content/schemas.mjs';

/** The ways a CMS save can go wrong. */
const BAD_INPUTS = {
  'empty object': {},
  'all nulls': new Proxy({}, { get: () => null, has: () => true, ownKeys: () => [] }),
  'empty strings and arrays': {
    title: '', question: '', quote: '', name: '', description: '', authorName: '',
    eventType: '', role: '', eyebrowTag: '', inclusions: [], services: [],
  },
  'wrong types': {
    title: 42, priceFrom: 'free', order: 'first', inclusions: 'not an array',
    services: {}, year: 'last year', rating: 'five', step: null, question: [],
  },
  'out of range': { priceFrom: -100, rating: 99, step: 17, year: 1200, order: 1.5 },
  'unknown enum values': { group: 'made-up-group', category: 'nonsense', source: 'tiktok' },
};

let failures = 0;

for (const [collection, schema] of Object.entries(allSchemas)) {
  for (const [label, input] of Object.entries(BAD_INPUTS)) {
    try {
      const result = schema.parse(input);
      assert(result && typeof result === 'object', `${collection} / ${label}: parsed to a non-object`);
    } catch (err) {
      failures += 1;
      console.error(`FAIL  ${collection} — ${label}\n      ${err.message.split('\n')[0]}`);
    }
  }
}

// The fallbacks must also be usable, not just non-throwing: templates index into
// these, so a null where an array belongs would still crash the render.
const svc = allSchemas.services.parse({ inclusions: 'not an array' });
assert(Array.isArray(svc.inclusions), 'services.inclusions must fall back to an array');
const grp = allSchemas['service-groups'].parse({});
assert(Array.isArray(grp.services), 'service-groups.services must fall back to an array');
const rev = allSchemas.reviews.parse({ rating: 99 });
assert(rev.rating >= 1 && rev.rating <= 5, 'reviews.rating must fall back into 1-5');
const step = allSchemas.process.parse({ step: 17 });
assert(step.step >= 1 && step.step <= 4, 'process.step must fall back into 1-4');

if (failures) {
  console.error(`\n${failures} schema(s) would break the build on a bad CMS save.`);
  process.exit(1);
}
console.log('No bad CMS save can fail the build — all schemas degrade to safe defaults.');
