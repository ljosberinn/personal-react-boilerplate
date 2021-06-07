import { useCallback, useContext, useMemo } from 'react';

import { IS_PROD } from '../../constants';
import type { Namespace } from '../../constants';
import { I18NContext } from '../context/I18NContext';

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
  locale: string;
  t: TFunction;
};

export function useTranslation(ns?: Namespace): UseTranslationReturn {
  const ctx = useContext(I18NContext);

  const t: TFunction = useCallback(
    (maybeKey, interpolation): string => {
      // no bundle, only cry
      if (!ctx?.resources || !ctx?.locale) {
        return Array.isArray(maybeKey) ? maybeKey.join(':') : maybeKey;
      }

      const [namespace, key] = normalize({ key: maybeKey, namespace: ns });

      if (namespace) {
        const match = ctx.resources[ctx.locale][namespace]?.[key];

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
      locale: ctx.locale,
      t,
    }),
    [ctx.locale, t]
  );
}
