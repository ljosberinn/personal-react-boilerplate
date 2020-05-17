import i18n from 'i18next';
import i18nCache from 'locales';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  debug: false,
  load: 'languageOnly',
  resources: i18nCache,
  interpolation: {
    escapeValue: false,
  },
  react: { useSuspense: false },
});

export default i18n;
