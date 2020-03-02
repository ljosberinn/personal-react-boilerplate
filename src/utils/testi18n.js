import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

import { ENABLED_LANGUAGES } from '../constants/env';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    load: 'languageOnly',
    resources: ENABLED_LANGUAGES.reduce((carry, slug) => {
      carry[slug] = {};
      return carry;
    }, {}),
    interpolation: {
      escapeValue: false,
    },
    react: { useSuspense: false },
  });

export default i18n;
