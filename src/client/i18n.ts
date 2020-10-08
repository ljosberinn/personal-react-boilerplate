// contains lots of inspiration from https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/utils/i18nextLocize.ts
import type { IncomingMessage } from 'http';
import type { i18n as I18nInstance } from 'i18next';
import i18next from 'i18next';
import absoluteUrl from 'next-absolute-url';
import { initReactI18next } from 'react-i18next';

import type { Namespace } from '../../src/constants';
import {
  IS_PROD,
  ENABLED_LANGUAGES,
  IS_BROWSER,
  IS_TEST,
  FALLBACK_LANGUAGE,
  namespaces as allNamespaces,
} from '../../src/constants';
import type { KarmaCoreProps } from './Karma';

export const i18nCookieName = 'i18next';

type InitI18NextArgs = Pick<KarmaCoreProps['i18n'], 'language'> &
  (
    | // only the currently detected language will be available onload
    Pick<KarmaCoreProps['i18n'], 'bundle'>
    // tests have access to all localizations
    | { i18nCache: I18nextResources }
  );

export const initI18Next = ({
  language,
  ...rest
}: InitI18NextArgs): I18nInstance => {
  const instance = i18next.use(initReactI18next);

  const resources =
    'i18nCache' in rest
      ? rest.i18nCache
      : {
          [language]: rest.bundle as I18nextResources,
        };

  instance
    .init({
      cleanCode: true,
      debug: !IS_PROD && !IS_TEST,
      // removes translation default key
      defaultNS: undefined,
      fallbackLng: FALLBACK_LANGUAGE,
      interpolation: {
        // not needed with react
        escapeValue: false,
      },
      lng: language,
      // remove if you want to use localization (en-US, en-GB)
      load: 'languageOnly',
      lowerCaseLng: true,
      react: {
        // not compatible with SSR
        useSuspense: false,
      },
      resources,
      supportedLngs: ENABLED_LANGUAGES,
    })
    // eslint-disable-next-line no-console
    .catch(console.error);

  if (IS_BROWSER) {
    const html = document.querySelector('html');

    if (html) {
      instance.on('languageChanged', (lang) => {
        html.setAttribute('lang', lang);
        html.setAttribute('dir', instance.dir(lang));

        document.cookie = `${i18nCookieName}=${lang}`;
      });

      // set initially aswell
      html.setAttribute('lang', language);
    }
  }

  return instance;
};

export declare type I18nextNamespace = Record<string, string>;

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
export declare type I18nextResourceLocale = Record<Namespace, I18nextNamespace>;

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
export declare type I18nextResources = Record<string, I18nextResourceLocale>;

/**
 * Memoized i18next resources are timestamped to allow cache invalidation
 * strategies
 * The timestamp's value is the time when the memoized cache was created
 */
export declare type MemoizedI18nextResources = {
  json: I18nextNamespace;
  ts: number; // Timestamp in milliseconds
};

/**
 * In-memory cache of the i18next resources
 *
 * Useful to avoid over-fetching the API, but rather rely on the memoized cache
 * when available
 *
 */
const _memoizedI18nextResources = new Map<string, MemoizedI18nextResources>();

/**
 * Milliseconds to cache i18n client side for.
 *
 * - 1 hour in prod
 * - 60 seconds in dev
 */
const memoizedCacheMaxAge = (IS_BROWSER || IS_PROD ? 60 * 60 : 60) * 1000;

export const i18nEndpoint = '/api/v1/i18n/';

type GetI18nOptions = {
  req?: IncomingMessage;
  namespaces?: Namespace[];
};

type GetI18nPathArguments = {
  language: string;
  namespace: string;
};

export const getI18nPathByLanguageAndNamespace = ({
  language,
  namespace,
}: GetI18nPathArguments): string =>
  `/static/locales/${language}/${namespace}.json`;

const getSafeLanguageAndNamespace = ({
  language,
  namespaces,
}: {
  language: string;
  namespaces?: Namespace[];
}) => {
  const safeLanguage = ENABLED_LANGUAGES.includes(language)
    ? language
    : FALLBACK_LANGUAGE;

  const safeNamespaces = namespaces ?? [...new Set(allNamespaces)];

  return {
    language: safeLanguage,
    namespacesToLoad: safeNamespaces,
  };
};

export const getI18n = async (
  lang: string,
  { req, namespaces }: GetI18nOptions = {}
): Promise<Partial<I18nextResourceLocale>> => {
  const { language, namespacesToLoad } = getSafeLanguageAndNamespace({
    language: lang,
    namespaces,
  });

  const ts = Date.now();

  const { origin } = absoluteUrl(req);

  const data = await Promise.allSettled<Promise<I18nextNamespace>>(
    namespacesToLoad.map(async (namespace) => {
      const url =
        origin + getI18nPathByLanguageAndNamespace({ language, namespace });

      const memoizedResources = IS_TEST
        ? null
        : _memoizedI18nextResources.get(url);

      /* istanbul ignore next */
      if (
        memoizedResources &&
        ts - memoizedResources.ts < memoizedCacheMaxAge
      ) {
        return memoizedResources.json;
      }

      const response = await fetch(url);
      const json: I18nextNamespace = await response.json();

      _memoizedI18nextResources.set(url, { json, ts });

      return json;
    })
  );

  return data.reduce<Partial<I18nextResourceLocale>>(
    (carry, dataset, index) => {
      /* istanbul ignore next */
      if (dataset.status === 'rejected') {
        return carry;
      }

      const namespace = namespacesToLoad[index];
      carry[namespace] = dataset.value;
      return carry;
    },
    {}
  );
};

/**
 * retrieves currently demanded i18nBundle in `getStaticProps`
 */
export const getStaticI18n = async (
  lang: string,
  { namespaces }: Pick<GetI18nOptions, 'namespaces'> = {}
): Promise<Partial<I18nextResourceLocale>> => {
  const { language, namespacesToLoad } = getSafeLanguageAndNamespace({
    language: lang,
    namespaces,
  });

  const bundles = await Promise.all<[Namespace, I18nextNamespace]>(
    namespacesToLoad.map(async (namespace) => {
      // eslint-disable-next-line import/dynamic-import-chunkname
      const json = await import(
        `../../public/static/locales/${language}/${namespace}.json`
      );

      return [namespace, json.default];
    })
  );

  return Object.fromEntries(bundles);
};
