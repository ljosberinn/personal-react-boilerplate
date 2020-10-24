import { createContext, useEffect } from 'react';

import { IS_BROWSER, I18N_COOKIE_NAME } from '../../../constants';
import type { WithChildren } from '../../karma/types';
import type { I18NContextDefinition } from './types';

type I18NContextProviderProps = WithChildren<I18NContextDefinition>;

export const I18NContext = createContext<I18NContextDefinition | null>(null);

export function I18NContextProvider({
  children,
  language,
  resources,
}: I18NContextProviderProps): JSX.Element {
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
