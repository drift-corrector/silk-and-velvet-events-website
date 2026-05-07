export const PHONE = '+16468208418';
export const PHONE_DISPLAY = '646.820.8418';
export const EMAIL = 'silk.and.velvet.events1@gmail.com';
export const INSTAGRAM_HANDLE = 'silkandvelvet_events';
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
export const FACEBOOK_PAGE = 'SilkandVelvetEvents';
export const FACEBOOK_URL = `https://facebook.com/${FACEBOOK_PAGE}`;
export const MESSENGER_URL = `https://m.me/${FACEBOOK_PAGE}`;

const inquiryBody = encodeURIComponent("Hi Sofiya, I'd love to chat about an event ...");

export const SMS_HREF = `sms:${PHONE}?body=${inquiryBody}`;
export const EMAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent('Event inquiry')}`;

export const CONTACT_CHANNELS = [
  { id: 'text', label: 'Text', icon: '💬', href: SMS_HREF },
  { id: 'instagram', label: 'Instagram', icon: '📷', href: INSTAGRAM_URL },
  { id: 'messenger', label: 'Messenger', icon: '💭', href: MESSENGER_URL },
  { id: 'email', label: 'Email', icon: '✉', href: EMAIL_HREF },
] as const;

export const SERVICE_AREAS = ['New York City', 'Long Island', 'New Jersey'] as const;

export const TEAM = {
  founder: 'Sofiya',
  assistants: ['Angie', 'Inna'] as const,
};
