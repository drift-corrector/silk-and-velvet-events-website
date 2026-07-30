import { SITE_URL } from '~/lib/seo';

/**
 * Both forms POST straight to Web3Forms, which emails the submission to the
 * address on the Web3Forms account. No backend, no serverless function — the
 * site stays fully static.
 *
 * PUBLIC_WEB3FORMS_KEY is safe to ship to the browser by design: it only
 * identifies which inbox to deliver to, and Web3Forms rejects submissions whose
 * Origin isn't on the account's allow-list.
 */
export const FORM_ACTION = 'https://api.web3forms.com/submit';

export const FORM_KEY = import.meta.env.PUBLIC_WEB3FORMS_KEY as string | undefined;

/** Web3Forms needs an absolute URL to redirect to after a successful post. */
export function thanksUrl(): string {
  return new URL('/thanks/', SITE_URL).toString();
}
