import { useCallback, useContext, useEffect } from 'react';

import type { Namespace } from '../../../constants';
import { IS_BROWSER, IS_PROD } from '../../../constants';
import type { WithChildren } from '../../karma/types';
import type { I18NContextDefinition } from './I18NContext';
import { I18NContext } from './I18NContext';

type NormalizeArgs = {
  namespace?: Namespace;
  key: string | [Namespace, string];
};

const normalize = ({
  namespace,
  key,
}: NormalizeArgs): [Namespace | undefined, string] => {
  if (namespace) {
    // different namespace access
    if (Array.isArray(key)) {
      return key;
    }

    // different namespace access
    if (key.includes(':')) {
      return key.split(':') as [Namespace, string];
    }

    // predefined namespace access
    return [namespace, key];
  }

  // adhoc namespace access
  if (Array.isArray(key)) {
    return key;
  }

  // adhoc namespace access
  if (key.includes(':')) {
    return key.split(':') as [Namespace, string];
  }

  return [undefined, key];
};

const warnCache = IS_PROD ? undefined : new Set<string>();

const warn = IS_PROD
  ? undefined
  : (key: string) => {
      if (!warnCache?.has(key)) {
        // eslint-disable-next-line no-console
        console.warn(
          `%c⚠️ [Karma/t] unknown i18n key "${key}"`,
          'color: orange;'
        );

        warnCache?.add(key);
      }
    };

export type TFunction = (key: string | [Namespace, string]) => string;
export type UseTranslationReturn = {
  language: string;
  t: TFunction;
};

export function useTranslation(namespace?: Namespace): UseTranslationReturn {
  const ctx = useContext(I18NContext);

  const t: TFunction = useCallback(
    (key: string | [Namespace, string]): string => {
      // no bundle, only cry
      if (!ctx?.resources || !ctx?.language) {
        return Array.isArray(key) ? key.join(':') : key;
      }

      const { language, resources } = ctx;

      const [safeNamespace, safeKey] = normalize({ key, namespace });

      if (safeNamespace) {
        const match = resources[language][safeNamespace]?.[safeKey];

        if (match) {
          return match;
        }

        const merged = `${safeNamespace}:${safeKey}`;

        warn?.(merged);

        return merged;
      }

      warn?.(safeKey);

      return safeKey;
    },
    [ctx, namespace]
  );

  if (!ctx) {
    throw new Error(
      '[Karma/useTranslation] called outside of an I18NContextProvider.'
    );
  }

  return { language: ctx.language, t };
}

export type I18NContextProvider = WithChildren<I18NContextDefinition>;

export function I18NContextProvider({
  children,
  language,
  resources,
}: I18NContextProvider): JSX.Element {
  useEffect(() => {
    if (IS_BROWSER) {
      const html = document.querySelector('html');

      if (html) {
        html.setAttribute('lang', language);

        /**
         * @see https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
         */
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

        html.setAttribute('dir', RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr');

        document.cookie = `$NEXT_LOCALE=${language}; max-age=31536000; path=/`;

        // set initially aswell
        html.setAttribute('lang', language);
      }
    }
  }, [language]);

  // no need to memoize - whenever language changes, resources change too
  // which only ever happens during navigation
  const value = {
    language,
    resources,
  };

  return <I18NContext.Provider value={value}>{children}</I18NContext.Provider>;
}
