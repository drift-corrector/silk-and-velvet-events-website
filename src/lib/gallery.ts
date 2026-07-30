import gallery from '~/data/gallery.json';

export interface Photo {
  /** Empty string = no upload yet; GalleryGrid falls back to a gradient tile. */
  src?: string;
  alt: string;
  caption?: string;
}

export interface Category {
  slug: string;
  label: string;
  sub: string;
  cardSub: string;
  seoDescription: string;
  cover: string;
}

export const galleryPage = gallery.page;

/** Rows with a blank slug would generate a broken route — drop them. */
export const categories: Category[] = gallery.categories.filter((c) => Boolean(c.slug));

function toPhoto(p: (typeof gallery.photos)[number]): Photo {
  return { src: p.image || undefined, alt: p.alt, caption: p.caption || undefined };
}

export function photosFor(slug: string): Photo[] {
  return gallery.photos.filter((p) => p.category === slug).map(toPhoto);
}

export function featuredPhotos(limit: number): Photo[] {
  return gallery.photos.filter((p) => p.featured).slice(0, limit).map(toPhoto);
}

/**
 * Gradient-only tiles, used when a category has no rows yet so a fresh category
 * never renders as an empty page. Matches how the whole gallery looked before
 * any real photos existed.
 */
export function placeholderPhotos(label: string, count = 9): Photo[] {
  return Array.from({ length: count }, (_, i) => ({
    alt: `${label} sample ${i + 1}`,
    caption: `${label} · ${i + 1}`,
  }));
}
