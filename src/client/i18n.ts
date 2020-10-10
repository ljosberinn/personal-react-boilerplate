// contains lots of inspiration from https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/utils/i18nextLocize.ts
import type { i18n as I18nInstance } from 'i18next';
import i18next from 'i18next';
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

type GetI18nOptions = {
  namespaces?: Namespace[];
};

/**
 * retrieves currently demanded i18nBundle
 */
export const getI18n = async (
  lang: string,
  { namespaces }: GetI18nOptions = {}
): Promise<Partial<I18nextResourceLocale>> => {
  const language = ENABLED_LANGUAGES.includes(lang) ? lang : FALLBACK_LANGUAGE;
  const namespacesToLoad = namespaces ?? [...new Set(allNamespaces)];

  const bundles = await Promise.all<[Namespace, I18nextNamespace]>(
    namespacesToLoad.map(async (namespace) => {
      // eslint-disable-next-line import/dynamic-import-chunkname
      const json = await import(`../../locales/${language}/${namespace}.json`);

      return [namespace, json.default];
    })
  );

  return Object.fromEntries(bundles);
};
