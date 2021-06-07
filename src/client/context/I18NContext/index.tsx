import { createContext, useEffect } from 'react';

import { I18N_COOKIE_NAME } from '../../../constants';
import type { WithChildren } from '../../karma/types';
import type { I18NContextDefinition } from './types';

type I18NContextProviderProps = WithChildren<I18NContextDefinition>;

export const I18NContext = createContext<I18NContextDefinition | null>(null);

export function I18NContextProvider({
  children,
  locale,
  resources,
}: I18NContextProviderProps): JSX.Element {
  useEffect(() => {
    const html = document.querySelector('html');

    if (html) {
      html.setAttribute('lang', locale);

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

      html.setAttribute('dir', RTL_LANGUAGES.has(locale) ? 'rtl' : 'ltr');

      // set initially aswell
      html.setAttribute('lang', locale);
    }
  }, [locale]);

  useEffect(() => {
    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = `${I18N_COOKIE_NAME}=${locale}; max-age=31536000; path=/`;
  }, [locale]);

  // no need to memoize - whenever locale changes, resources change too
  // which only ever happens during navigation
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    locale,
    resources,
  };

  return <I18NContext.Provider value={value}>{children}</I18NContext.Provider>;
}
