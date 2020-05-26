// contains lots of inspiration from https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/utils/i18nextLocize.ts
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

export const defaultNamespace = 'common';

const endpoint = '/api/i18n?language={{lng}}';

export const initI18Next = ({
  lang,
  defaultLocales,
}: AppRenderProps['pageProps']) => {
  const i18nInstance = i18n.use(initReactI18next);

  i18nInstance.init({
    lng: lang,
    fallbackLng:
      lang === SUPPORTED_LANGUAGES_MAP.en
        ? SUPPORTED_LANGUAGES_MAP.de
        : SUPPORTED_LANGUAGES_MAP.en,
    debug: !IS_PROD,
    lowerCaseLng: true,
    interpolation: {
      escapeValue: false, // not needed with react
    },
    cleanCode: true,
    load: 'languageOnly', // Remove if you want to use localization (en-US, en-GB)
    resources: {
      [lang]: defaultLocales,
    },
    ns: [defaultNamespace], // removes 'translation' default key from backend query,
    defaultNS: defaultNamespace,
    whitelist: ENABLED_LANGUAGES,
    react: {
      useSuspense: false, // Not compatible with SSR
    },
  });

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

const interpolateEndpoint = (lang: string) => endpoint.replace('{{lng}}', lang);

export const fetchTranslations = async (
  lang: string,
  req?: IncomingMessage
) => {
  const url = interpolateEndpoint(lang);
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
      console.error('Failed to parse i18n JSON');
    }
  } catch (error) {
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
 *
 * Then, fetches the corresponding data.
 */
export const detectAndGetTranslation = async (ctx: NextPageContext) => {
  const { req } = ctx;

  const lang = universalLanguageDetect({
    supportedLanguages: ENABLED_LANGUAGES,
    fallbackLanguage: SUPPORTED_LANGUAGES_MAP.en,
    acceptLanguageHeader: req?.headers['accept-language'],
    serverCookies: nextCookies(ctx),
  });

  const defaultLocales = await fetchTranslations(lang, req);

  return {
    lang,
    defaultLocales,
  };
};
