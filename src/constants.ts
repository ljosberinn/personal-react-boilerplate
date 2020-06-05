import { Provider } from './client/context/AuthContext/AuthContext';

export const ENABLED_PROVIDER = process.env.NEXT_PUBLIC_ENABLED_PROVIDER!.split(
  ','
) as Provider[];

/* i18n start */
export const ENABLED_LANGUAGES = process.env.NEXT_PUBLIC_ENABLED_LANGUAGES!.split(
  ','
);

export const SUPPORTED_LANGUAGES_MAP = ENABLED_LANGUAGES.reduce<{
  [key: string]: string;
}>((carry, lang) => {
  carry[lang] = lang;
  return carry;
}, {});

/* i18n end */

/* utils start */
export const IS_BROWSER = typeof window !== 'undefined';
export const IS_PROD = process.env.NODE_ENV === 'production';
/* utils end */

/* auth start */
export const SESSION_COOKIE_SECRET = process.env.SESSION_COOKIE_SECRET!;
// TS does not like this variable coming out of env
export const SESSION_COOKIE_NAME = 'session';
export const SESSION_LIFETIME = process.env.SESSION_LIFETIME
  ? parseInt(process.env.SESSION_LIFETIME!) * 1000
  : 60 * 60 * 8;

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID!;
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET!;

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
/* auth end */
