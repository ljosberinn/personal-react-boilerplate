import { COOKIE_LOOKUP_KEY_LANG } from '@unly/universal-language-detector';
import i18n from 'i18next';
import cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

import { RTL_LANGUAGES } from '../src/client/i18n';
import { IS_BROWSER } from '../src/constants';
import i18nCache from '../src/server/i18n';

const i18nInstance = i18n.use(initReactI18next);

i18nInstance.init({
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  load: 'languageOnly',
  react: { useSuspense: false },
  resources: i18nCache,
});

if (IS_BROWSER) {
  i18nInstance.on('languageChanged', lang => {
    const html = document.querySelector('html');

    html?.setAttribute('lang', lang);
    html?.setAttribute('dir', RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr');

    cookies.set(COOKIE_LOOKUP_KEY_LANG, lang);
  });
}

export default i18nInstance;
