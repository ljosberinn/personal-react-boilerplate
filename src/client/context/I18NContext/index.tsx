import { useCallback, useContext, useEffect, useMemo } from 'react';

import type { Namespace } from '../../../constants';
import { IS_BROWSER, IS_PROD, I18N_COOKIE_NAME } from '../../../constants';
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

const warn = IS_PROD
  ? undefined
  : (() => {
      const caches = {
        exists: new Set<string>(),
        interpolation: new Set<string>(),
      };

      return {
        add: (cache: keyof typeof caches, key: string) => {
          if (!caches[cache].has(key)) {
            const message =
              cache === 'exists'
                ? `unknown i18n key "${key}"`
                : `invalid interpolation for "${key}"`;

            // eslint-disable-next-line no-console
            console.warn(`%c⚠️ [Karma/t] ${message}`, 'color: orange;');

            caches[cache].add(key);
          }
        },
      };
    })();

type Interpolation = Record<string, string | number>;

const interpolate = (
  match: string,
  interpolation: Interpolation,
  { namespace, key }: { namespace: string; key: string }
): string => {
  return Object.entries(interpolation).reduce((carry, [placeholder, value]) => {
    const ph = `{{${placeholder}}}`;
    const exists = carry.includes(ph);

    if (exists) {
      return carry.replace(ph, `${value}`);
    }

    warn?.add('interpolation', `${ph}@${namespace}:${key}`);

    return carry;
  }, match);
};

export type TFunction = (
  key: string | [Namespace, string],
  interpolation?: Interpolation
) => string;
export type UseTranslationReturn = {
  language: string;
  t: TFunction;
};

export function useTranslation(ns?: Namespace): UseTranslationReturn {
  const ctx = useContext(I18NContext);

  const t: TFunction = useCallback(
    (maybeKey, interpolation): string => {
      // no bundle, only cry
      if (!ctx?.resources || !ctx?.language) {
        return Array.isArray(maybeKey) ? maybeKey.join(':') : maybeKey;
      }

      const [namespace, key] = normalize({ key: maybeKey, namespace: ns });

      if (namespace) {
        const match = ctx.resources[ctx.language][namespace]?.[key];

        if (match) {
          return interpolation
            ? interpolate(match, interpolation, {
                key,
                namespace,
              })
            : match;
        }

        const merged = `${namespace}:${key}`;

        warn?.add('exists', merged);

        return merged;
      }

      warn?.add('exists', key);

      return key;
    },
    [ctx, ns]
  );

  if (!ctx) {
    throw new Error(
      '[Karma/useTranslation] called outside of an I18NContextProvider.'
    );
  }

  return useMemo(
    () => ({
      language: ctx.language,
      t,
    }),
    [ctx.language, t]
  );
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

        document.cookie = `${I18N_COOKIE_NAME}=${language}; max-age=31536000; path=/`;

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
