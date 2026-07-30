import site from '~/data/site.json';

// Raw facts live in src/data/site.json (CMS-editable). Everything below is
// derived, so the CMS only ever has to hold the facts.
export const PHONE = site.phone;
export const PHONE_DISPLAY = site.phoneDisplay;
export const EMAIL = site.email;
export const INSTAGRAM_HANDLE = site.instagramHandle;
export const FACEBOOK_PAGE = site.facebookPage;
export const FOOTER_TAGLINE = site.footerTagline;

export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
export const FACEBOOK_URL = `https://facebook.com/${FACEBOOK_PAGE}`;
export const MESSENGER_URL = `https://m.me/${FACEBOOK_PAGE}`;

const inquiryBody = encodeURIComponent(site.smsPrefill);

export const SMS_HREF = `sms:${PHONE}?body=${inquiryBody}`;
export const EMAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent('Event inquiry')}`;

// `handle` is the display line under each channel label — was duplicated as
// literals in contact.astro before.
export const CONTACT_CHANNELS = [
  { id: 'text', label: 'Text', icon: '💬', href: SMS_HREF, handle: PHONE_DISPLAY },
  { id: 'instagram', label: 'Instagram', icon: '📷', href: INSTAGRAM_URL, handle: `@${INSTAGRAM_HANDLE}` },
  { id: 'messenger', label: 'Messenger', icon: '💭', href: MESSENGER_URL, handle: `m.me/${FACEBOOK_PAGE}` },
  { id: 'email', label: 'Email', icon: '✉', href: EMAIL_HREF, handle: EMAIL },
] as const;

export const SERVICE_AREAS = site.serviceAreas;
