import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME } from '../../constants';

type UseI18nRoutingType = {
  changeLocale: (locale: string) => Promise<void>;
  createChangeLocaleHandler: (locale: string) => () => Promise<void>;
};

export function useI18nRouting(): UseI18nRoutingType {
  const { push, route } = useRouter();
  const { i18n } = useTranslation();

  const changeLocale = useCallback(
    async (locale: string) => {
      const targetRoute = route.replace(
        `[${DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME}]`,
        locale
      );

      await i18n.changeLanguage(locale);

      try {
        await push(targetRoute);
      } catch {
        window.location.assign(targetRoute);
      }
    },
    [push, route, i18n]
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
