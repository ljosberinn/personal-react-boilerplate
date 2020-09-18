/* eslint-disable @typescript-eslint/no-non-null-assertion, spaced-comment */
import type { Provider } from '../karma/client/context/AuthContext/AuthContext';

/**********************
 * utilities
 *********************/
export const IS_BROWSER = typeof window !== 'undefined';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_TEST = process.env.NODE_ENV === 'test';

/**********************
 * auth
 *********************/

/**
 * string joined by `,` - containing all currently enabled provider
 *
 * @example
 * ```sh
 * facebook,github,discord,google
 * ```
 */
export const ENABLED_PROVIDER = process.env.NEXT_PUBLIC_ENABLED_PROVIDER.split(
  ','
) as Provider[];

// TS does not like this variable coming out of env
export const SESSION_COOKIE_NAME = 'session';

/**
 * session lifetime in milliseconds
 *
 * @default 28800 seconds
 * @default 8 hours
 */
export const SESSION_LIFETIME =
  Number.parseInt(process.env.NEXT_PUBLIC_SESSION_LIFETIME!) * 1000;

export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID!;
export const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET!;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

/**********************
 * i18n
 *********************/

/**
 * string joined by `,` - containing all currently enabled languages
 *
 * @default en,de
 */
export const ENABLED_LANGUAGES = process.env.NEXT_PUBLIC_ENABLED_LANGUAGES.split(
  ','
);

/**
 * the fallback language used if:
 * - the users language cannot be inferred
 * - the users language is not supported
 *
 * MUST BE INCLUDED IN ENABLED_LANGUAGES
 *
 * @default en
 */ export const FALLBACK_LANGUAGE = process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE;

export const namespaces = ['i18n', 'auth', 'theme', 'serviceWorker'] as const;
export type Namespace = typeof namespaces[number];

/**********************
 * sentry
 *********************/
/**
 * Sentry API endpoint for this project
 */
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/**********************
 * meta
 *********************/
export const BUILD_TIME = new Date().toString();
export const BUILD_TIMESTAMP = Date.now();
