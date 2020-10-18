import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME,
  ENABLED_LANGUAGES,
  IS_PROD,
} from '../../constants';

type UseI18nRoutingType = {
  changeLocale: (locale: string) => Promise<void>;
  createChangeLocaleHandler: (locale: string) => () => Promise<void>;
};

export function useI18nRouting(): UseI18nRoutingType {
  const { replace, route } = useRouter();
  const { i18n } = useTranslation();

  const changeLocale = useCallback(
    async (locale: string) => {
      if (!ENABLED_LANGUAGES.includes(locale)) {
        /* istanbul ignore next */
        if (!IS_PROD) {
          // eslint-disable-next-line no-console
          console.warn(
            `[Karma/useI18nRouting]: passed locale "${locale}" to "changeLocale" but it's not included in ENABLED_LANGUAGES. As a result, nothing happens!`
          );
        }
        return;
      }

      const targetRoute = route.replace(
        `[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]`,
        locale
      );

      await i18n.changeLanguage(locale);

      try {
        await replace(targetRoute);
      } catch {
        window.location.assign(targetRoute);
      }
    },
    [replace, route, i18n]
  );

  const createChangeLocaleHandler = useCallback(
    (locale: string) => () => changeLocale(locale),
    [changeLocale]
  );

  return {
    changeLocale,
    createChangeLocaleHandler,
  };
}
