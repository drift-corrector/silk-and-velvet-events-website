import { defineCollection, z } from 'astro:content';

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  noindex: z.boolean().optional(),
}).optional();

const SERVICE_GROUPS = ['whole-thing', 'day-of', 'pretty-part', 'balloon', 'pick-choose'] as const;

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    shortName: z.string().optional(),
    description: z.string(),
    priceFrom: z.number().int().nonnegative(),
    group: z.enum(SERVICE_GROUPS),
    order: z.number().int(),
    inclusions: z.array(z.string()).min(1),
    seoDrillDown: z.string().optional(),
    seo: seoSchema,
  }),
});

const serviceGroups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    eyebrowTag: z.string(),
    priceFrom: z.number().int().nonnegative(),
    order: z.number().int(),
    services: z.array(z.string()).min(1),
    description: z.string(),
    ctaLabel: z.string().default('Inquire'),
    photo: z.string().optional(),
    photoCaption: z.string().optional(),
  }),
});

const faq = defineCollection({
  type: 'content',
  schema: z.object({
    question: z.string(),
    category: z.enum(['booking', 'pricing', 'planning', 'logistics', 'general']).default('general'),
    order: z.number().int().default(0),
  }),
});

const reviews = defineCollection({
  type: 'content',
  schema: z.object({
    quote: z.string(),
    authorName: z.string(),
    eventType: z.string(),
    year: z.number().int().min(2018),
    source: z.enum(['facebook', 'google', 'direct']).default('direct'),
    rating: z.number().int().min(1).max(5).default(5),
  }),
});

const process = defineCollection({
  type: 'content',
  schema: z.object({
    step: z.number().int().min(1).max(4),
    name: z.string(),
    description: z.string(),
  }),
});

const team = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    order: z.number().int().default(0),
    photo: z.string().optional(),
    photoCaption: z.string().optional(),
  }),
});

export const collections = {
  services,
  'service-groups': serviceGroups,
  faq,
  reviews,
  process,
  team,
};
