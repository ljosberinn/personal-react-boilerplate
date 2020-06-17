// contains lots of inspiration from https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/utils/i18nextLocize.ts
import * as Sentry from '@sentry/node';
import universalLanguageDetect from '@unly/universal-language-detector';
import { IncomingMessage } from 'http';
import i18n from 'i18next';
import { NextPageContext } from 'next';
import absoluteUrl from 'next-absolute-url';
import nextCookies from 'next-cookies';
import { initReactI18next } from 'react-i18next';

import { AppRenderProps } from '../../pages/_app';
import {
  SUPPORTED_LANGUAGES_MAP,
  IS_PROD,
  ENABLED_LANGUAGES,
  IS_BROWSER,
} from '../constants';
import { namespaces } from '../server/i18n';

// see https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
const RTL_LANGUAGES = new Set([
  'ar', // Arabic
  'arc', // Aramaic
  'dv', // Divehi
  'fa', // Persian
  'ha', // Hakka Chinese
  'he', // Hebrew
  'khw', // Khowar
  'ks', // Kashmiri
  'ku', // Kurdish
  'ps', // Pashto
  'ur', // Urdu
  'yi', // Yiddish
]);

export const initI18Next = ({
  language,
  i18nBundle,
}: AppRenderProps['pageProps']) => {
  const i18nInstance = i18n.use(initReactI18next);

  i18nInstance.init({
    cleanCode: true,
    debug: !IS_PROD,
    defaultNS: 'common',
    fallbackLng:
      language === SUPPORTED_LANGUAGES_MAP.en
        ? SUPPORTED_LANGUAGES_MAP.de
        : SUPPORTED_LANGUAGES_MAP.en,

    interpolation: {
      escapeValue: false, // not needed with react
    },
    lng: language,
    // remove if you want to use localization (en-US, en-GB)
    load: 'languageOnly',
    lowerCaseLng: true,
    ns: namespaces, // removes 'translation' default key from backend query,
    react: {
      useSuspense: false, // not compatible with SSR
    },
    resources: {
      [language]: i18nBundle,
    },
    whitelist: ENABLED_LANGUAGES,
  });

  if (IS_BROWSER) {
    i18nInstance.on('languageChanged', lang => {
      const html = document.querySelector('html');

      html?.setAttribute('lang', lang);
      html?.setAttribute('dir', RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr');
    });
  }

  return i18nInstance;
};

export declare type I18nextNamespace = {
  [key: string]: string;
};

/**
 * @example
 * {
 *    "login": {
 *        "label": "Log in",
 *        "user": "User Name"
 *    }
 * }
 *
 */
export declare type I18nextResourceLocale = {
  [namespace: string]: I18nextNamespace;
};

/**
 * One or more i18next resources, indexed by lang
 *
 * @example
 * {
 *   fr: {
 *     "login": {
 *       "label": "Log in",
 *       "user": "User Name"
 *     }
 *   }
 * }
 */
export declare type I18nextResources = {
  [lang: string]: I18nextResourceLocale;
};

/**
 * Memoized i18next resources are timestamped, to allow for cache invalidation strategies
 * The timestamp's value is the time when the memoized cache was created
 */
export declare type MemoizedI18nextResources = {
  resources: I18nextResourceLocale;
  ts: number; // Timestamp in milliseconds
};

/**
 * In-memory cache of the i18next resources
 *
 * Useful to avoid over-fetching the API, but rather rely on the memoized cache when available
 *
 * @type {I18nextResources}
 * @private
 */
const _memoizedI18nextResources: {
  [endpoint: string]: MemoizedI18nextResources;
} = {};

/**
 * Milliseconds to cache i18n client side for
 */
const memoizedCacheMaxAge = (IS_BROWSER || IS_PROD ? 60 * 60 : 60) * 1000;

export const getI18N = async (lang: string, req?: IncomingMessage) => {
  const url = '/api/v1/i18n/' + lang;

  const memoizedI18nextResources = _memoizedI18nextResources[url];

  if (memoizedI18nextResources) {
    const date = Date.now();

    if (date - memoizedI18nextResources.ts < memoizedCacheMaxAge) {
      return memoizedI18nextResources.resources;
    }
  }

  let namespaces: I18nextResourceLocale = {};

  try {
    const { origin } = absoluteUrl(req);

    const response = await fetch(origin + url);
    try {
      namespaces = await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message, 'Failed to parse i18n JSON');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message, 'Failed to fetch i18n');
  }

  _memoizedI18nextResources[url] = {
    resources: namespaces,
    ts: Date.now(),
  };

  return namespaces;
};

/**
 * Dynamically detects the users preferred language based on
 *
 * - request header
 * - cookies
 *
 * and picks the best match from existing languages.
 */
export const detectLanguage = (ctx: NextPageContext) =>
  universalLanguageDetect({
    acceptLanguageHeader: ctx.req?.headers['accept-language'],
    errorHandler: (error, level, origin, context) => {
      Sentry.withScope(scope => {
        scope.setExtra('level', level);
        scope.setExtra('origin', origin);

        if (context) {
          scope.setContext('context', context);
        }

        Sentry.captureException(error);
      });
    },
    fallbackLanguage: SUPPORTED_LANGUAGES_MAP.en,
    serverCookies: nextCookies(ctx),
    supportedLanguages: ENABLED_LANGUAGES,
  });
