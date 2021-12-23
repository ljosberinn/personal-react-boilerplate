import {
  ENABLED_LANGUAGES,
  FALLBACK_LANGUAGE,
  namespaces as allNamespaces,
} from '../../constants';
import type { Namespace } from '../../constants';

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
export declare type I18nextResources =
  | Record<string, I18nextResourceLocale>
  | Record<string, Partial<I18nextResourceLocale>>;

type GetI18nOptions = {
  namespaces?: Namespace[];
};

/**
 * retrieves currently demanded i18nBundle
 */
export const getI18n = async (
  locale: string,
  { namespaces }: GetI18nOptions = {}
): Promise<I18nextResources> => {
  const language = ENABLED_LANGUAGES.includes(locale)
    ? locale
    : FALLBACK_LANGUAGE;
  const namespacesToLoad = namespaces ?? [...new Set(allNamespaces)];

  const bundles = await Promise.all(
    namespacesToLoad.map(async (namespace) => {
      // eslint-disable-next-line import/dynamic-import-chunkname
      const json: { default: Record<string, string> } = await import(
        `../../../locales/${language}/${namespace}.json`
      );

      return [namespace, json.default];
    })
  );

  return {
    [language]: Object.fromEntries(bundles),
  };
};
