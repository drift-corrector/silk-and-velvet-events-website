import { defineCollection } from 'astro:content';
import {
  servicesSchema,
  serviceGroupsSchema,
  faqSchema,
  reviewsSchema,
  processSchema,
  teamSchema,
} from './schemas.mjs';

// Schemas live in schemas.mjs so scripts/check-schema-resilience.mjs can import
// them without a build. See that file for why every field has a `.catch()`.

export const collections = {
  services: defineCollection({ type: 'content', schema: servicesSchema }),
  'service-groups': defineCollection({ type: 'content', schema: serviceGroupsSchema }),
  faq: defineCollection({ type: 'content', schema: faqSchema }),
  reviews: defineCollection({ type: 'content', schema: reviewsSchema }),
  process: defineCollection({ type: 'content', schema: processSchema }),
  team: defineCollection({ type: 'content', schema: teamSchema }),
};
