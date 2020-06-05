import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import i18nCache from '../locales';

i18n.use(initReactI18next).init({
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  lng: 'en',
  load: 'languageOnly',
  react: { useSuspense: false },
  resources: i18nCache,
});

export default i18n;
