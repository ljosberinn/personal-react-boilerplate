// contains lots of inspiration from https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/utils/i18nextLocize.ts
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import {
  SUPPORTED_LANGUAGES_MAP,
  IS_PROD,
  ENABLED_LANGUAGES,
  IS_BROWSER,
} from 'src/constants';

export const defaultNamespace = 'common';

const endpoint = '/api/i18n?language={{lng}}&namespace={{ns}}';

export const initI18Next = (lang: string, defaultLocales: I18nextResources) => {
  const i18nInstance = i18n.use(HttpApi).use(initReactI18next);

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
    resources: defaultLocales,
    ns: [defaultNamespace], // removes 'translation' default key from backend query,
    defaultNS: defaultNamespace,
    whitelist: ENABLED_LANGUAGES,
    react: {
      useSuspense: false, // Not compatible with SSR
    },
    backend: {
      loadPath: endpoint,
    },
  });

  return i18nInstance;
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
  [i18nKey: string]: I18nextResourceLocale; // The value can either be a string, or a nested object, itself containing either a string, or a nest object, etc.
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
  resources: I18nextResources;
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
  [locizeAPIEndpoint: string]: MemoizedI18nextResources;
} = {};

/**
 * Milliseconds to cache i18n client side for
 */
const memoizedCacheMaxAge = (IS_BROWSER || IS_PROD ? 60 * 60 : 60) * 1000;

const interpolateEndpoint = (lang: string, namespace: string) =>
  endpoint.replace('{{lng}}', lang).replace('{{ns}}', namespace);

export const fetchTranslations = async (
  lang: string,
  namespace = defaultNamespace
) => {
  const url = interpolateEndpoint(lang, namespace);

  const memoizedI18nextResources = _memoizedI18nextResources[url];

  if (memoizedI18nextResources) {
    const date = +new Date();

    if (date - memoizedI18nextResources.ts < memoizedCacheMaxAge) {
      return memoizedI18nextResources.resources;
    }
  }

  let locales = {};

  try {
    // TODO
    const response = await fetch(
      IS_PROD
        ? `https://personal-react-boilerplate.now.sh${url}`
        : `http://localhost:3000${url}`
    );
    try {
      locales = await response.json();
    } catch (error) {
      console.error('Failed to parse i18n JSON');
    }
  } catch (error) {
    console.error(error.message, 'Failed to fetch i18n');
  }

  _memoizedI18nextResources[url] = {
    resources: {
      [lang]: {
        [namespace]: locales,
      },
    },
    ts: +new Date(),
  };

  return locales;
};
