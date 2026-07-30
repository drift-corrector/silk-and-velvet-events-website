import { z } from 'astro/zod';

/**
 * Schemas for the markdown collections the CMS writes to.
 *
 * Every field uses `.catch(fallback)` rather than a bare requirement. A
 * required field that arrives missing or malformed would otherwise throw
 * `InvalidContentEntryDataError` and fail the production build — which, from
 * Sofiya's side, looks like a save that worked but never appeared, with no
 * error anywhere she can see. (Vercel keeps serving the last good deploy, so
 * the site stays up; her change just silently never lands.)
 *
 * `.catch()` covers both missing and wrong-typed values, so a bad save renders
 * a thin or empty section instead — visible, obviously wrong, and fixable by
 * her in the CMS. The CMS's own required-field validation is still the first
 * line of defence; this is the backstop for when it isn't enough.
 *
 * Kept in .mjs (not .ts) so scripts/check-schema-resilience.mjs can import
 * these directly without a build step.
 */

const seoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.string().optional(),
    noindex: z.boolean().optional(),
  })
  .optional()
  .catch(undefined);

export const SERVICE_GROUPS = ['whole-thing', 'day-of', 'pretty-part', 'balloon', 'pick-choose'];

export const servicesSchema = z.object({
  title: z.string().catch(''),
  shortName: z.string().optional().catch(undefined),
  description: z.string().catch(''),
  priceFrom: z.number().int().nonnegative().catch(0),
  // An unrecognised group means the service renders in no package rather than
  // being silently dropped into the wrong one.
  group: z.enum(SERVICE_GROUPS).optional().catch(undefined),
  order: z.number().int().catch(0),
  inclusions: z.array(z.string()).catch([]),
  seoDrillDown: z.string().optional().catch(undefined),
  seo: seoSchema,
});

export const serviceGroupsSchema = z.object({
  title: z.string().catch(''),
  eyebrowTag: z.string().catch(''),
  priceFrom: z.number().int().nonnegative().catch(0),
  order: z.number().int().catch(0),
  services: z.array(z.string()).catch([]),
  description: z.string().catch(''),
  ctaLabel: z.string().catch('Inquire'),
  photo: z.string().optional().catch(undefined),
  photoCaption: z.string().optional().catch(undefined),
});

export const faqSchema = z.object({
  question: z.string().catch(''),
  category: z
    .enum(['booking', 'pricing', 'planning', 'logistics', 'general'])
    .catch('general'),
  order: z.number().int().catch(0),
});

export const reviewsSchema = z.object({
  quote: z.string().catch(''),
  authorName: z.string().catch(''),
  eventType: z.string().catch(''),
  // Was min(2018), which would have rejected a legitimate older event.
  year: z.number().int().catch(new Date().getFullYear()),
  source: z.enum(['facebook', 'google', 'direct']).catch('direct'),
  rating: z.number().int().min(1).max(5).catch(5),
});

export const processSchema = z.object({
  step: z.number().int().min(1).max(4).catch(1),
  name: z.string().catch(''),
  description: z.string().catch(''),
});

export const teamSchema = z.object({
  name: z.string().catch(''),
  role: z.string().catch(''),
  order: z.number().int().catch(0),
  photo: z.string().optional().catch(undefined),
  photoCaption: z.string().optional().catch(undefined),
});

export const allSchemas = {
  services: servicesSchema,
  'service-groups': serviceGroupsSchema,
  faq: faqSchema,
  reviews: reviewsSchema,
  process: processSchema,
  team: teamSchema,
};
