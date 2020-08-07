import { Provider } from './client/context/AuthContext/AuthContext';

/* utils */
export const IS_BROWSER = typeof window !== 'undefined';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

export const ENABLED_PROVIDER = process.env.NEXT_PUBLIC_ENABLED_PROVIDER!.split(
  ','
) as Provider[];

/* i18n */
export const ENABLED_LANGUAGES = process.env.NEXT_PUBLIC_ENABLED_LANGUAGES!.split(
  ','
);

export const SUPPORTED_LANGUAGES_MAP = ENABLED_LANGUAGES.reduce<{
  [key: string]: string;
}>((carry, lang) => {
  carry[lang] = lang;
  return carry;
}, {});

/* sentry */
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN!;

/* auth */
// TS does not like this variable coming out of env
export const SESSION_COOKIE_NAME = 'session';
export const SESSION_LIFETIME =
  Number.parseInt(process.env.NEXT_PUBLIC_SESSION_LIFETIME!) * 1000;

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID!;
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET!;

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
