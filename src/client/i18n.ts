// contains lots of inspiration from https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/utils/i18nextLocize.ts
import * as Sentry from '@sentry/node';
import universalLanguageDetect, {
  COOKIE_LOOKUP_KEY_LANG,
} from '@unly/universal-language-detector';
import i18n from 'i18next';
import { set } from 'js-cookie';
import { NextPageContext } from 'next';
import absoluteUrl from 'next-absolute-url';
import nextCookies from 'next-cookies';
import { initReactI18next } from 'react-i18next';

import { PageProps } from '../../pages/_app';
import {
  SUPPORTED_LANGUAGES_MAP,
  IS_PROD,
  ENABLED_LANGUAGES,
  IS_BROWSER,
  IS_TEST,
} from '../constants';
import { namespaces } from '../server/i18n';

/**
 * @see https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
 */
export const RTL_LANGUAGES = new Set([
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

type InitI18NextArgs = Pick<PageProps, 'language'> &
  (
    | {
        i18nBundle: PageProps['i18nBundle'];
      }
    | {
        i18nCache: I18nextResources;
      }
  );

export const initI18Next = ({ language, ...rest }: InitI18NextArgs) => {
  const instance = i18n.use(initReactI18next);

  const resources =
    'i18nCache' in rest
      ? // tests have access to all localizations
        rest.i18nCache
      : // only the currently detected language will be available during a render
        {
          [language]: rest.i18nBundle,
        };

  instance.init({
    cleanCode: true,
    debug: !IS_PROD && !IS_TEST,
    // removes translation default key
    defaultNS: undefined,
    fallbackLng:
      language === SUPPORTED_LANGUAGES_MAP.en
        ? SUPPORTED_LANGUAGES_MAP.de
        : SUPPORTED_LANGUAGES_MAP.en,
    interpolation: {
      // not needed with react
      escapeValue: false,
    },
    lng: language,
    // remove if you want to use localization (en-US, en-GB)
    load: 'languageOnly',
    lowerCaseLng: true,
    ns: namespaces,
    react: {
      // not compatible with SSR
      useSuspense: false,
    },
    resources,
    supportedLngs: ENABLED_LANGUAGES,
  });

  if (IS_BROWSER) {
    instance.on('languageChanged', lang => {
      const html = document.querySelector('html');

      if (html) {
        html.setAttribute('lang', lang);
        html.setAttribute('dir', RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr');
      }

      set(COOKIE_LOOKUP_KEY_LANG, lang);
    });
  }

  return instance;
};

/**
 * A generic function factory accepting the language to change to.
 * Loads missing bundles on demand.
 *
 * @param slug
 */
export const makeHandleLanguageChangeHandler = (slug: string) => {
  return async () => {
    const hasBundle = !!i18n.getDataByLanguage(slug);

    if (!hasBundle) {
      const resources = await getI18N(slug);

      Object.entries(resources).forEach(([namespace, bundle]) => {
        i18n.addResourceBundle(slug, namespace, bundle);
      });
    }

    await i18n.changeLanguage(slug);
  };
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
 *   en: {
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
 * Memoized i18next resources are timestamped to allow cache invalidation
 * strategies
 * The timestamp's value is the time when the memoized cache was created
 */
export declare type MemoizedI18nextResources = {
  resources: I18nextResourceLocale;
  ts: number; // Timestamp in milliseconds
};

/**
 * In-memory cache of the i18next resources
 *
 * Useful to avoid over-fetching the API, but rather rely on the memoized cache
 * when available
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

export const i18nEndpoint = '/api/v1/i18n/';

export const getI18N = async (lang: string, ctx?: NextPageContext) => {
  if (!ENABLED_LANGUAGES.includes(lang)) {
    return {};
  }

  const url = i18nEndpoint + lang;

  const memoizedI18nextResources = !IS_TEST && _memoizedI18nextResources[url];

  if (memoizedI18nextResources) {
    const date = Date.now();

    if (date - memoizedI18nextResources.ts < memoizedCacheMaxAge) {
      return memoizedI18nextResources.resources;
    }
  }

  let resources: I18nextResourceLocale = {};

  try {
    const { origin } = absoluteUrl(ctx?.req);
    const response = await fetch(origin + url);

    try {
      resources = await response.json();
    } catch (error) {
      Sentry.captureException(error);
      // eslint-disable-next-line no-console
      console.error(error.message, 'Failed to parse i18n JSON');
    }
  } catch (error) {
    Sentry.captureException(error);
    // eslint-disable-next-line no-console
    console.error(error.message, 'Failed to fetch i18n');
  }

  _memoizedI18nextResources[url] = {
    resources: resources,
    ts: Date.now(),
  };

  return resources;
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
