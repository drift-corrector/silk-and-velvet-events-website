import { SITE_URL } from '~/lib/seo';

/**
 * Both forms POST straight to Web3Forms, which emails the submission to the
 * address on the Web3Forms account. No backend, no serverless function — the
 * site stays fully static.
 *
 * WEB3_FORM_KEY is safe to ship to the browser by design: it only identifies
 * which inbox to deliver to, and Web3Forms rejects submissions whose Origin
 * isn't on the account's allow-list. It ends up inlined in the built HTML.
 *
 * No PUBLIC_ prefix because the vault names it WEB3_FORM_KEY. That works here
 * only because this is a static build — page frontmatter runs at build time,
 * where Astro exposes unprefixed vars. Don't move this read into a client-side
 * <script>; it would come back undefined.
 */
export const FORM_ACTION = 'https://api.web3forms.com/submit';

export const FORM_KEY = import.meta.env.WEB3_FORM_KEY as string | undefined;

/** Web3Forms needs an absolute URL to redirect to after a successful post. */
export function thanksUrl(): string {
  return new URL('/thanks/', SITE_URL).toString();
}
