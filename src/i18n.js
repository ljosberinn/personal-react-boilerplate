import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import BackendAdapter from 'i18next-multiload-backend-adapter';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(BackendAdapter)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      lookupLocalStorage: 'languagePreference',
      caches: ['localStorage'],
      order: ['localStorage', 'navigator'],
    },
    backend: {
      backend: XHR,
      backendOption: {
        loadPath: '.netlify/functions/locales?lng={{lng}}&ns={{ns}}',
        allowMultiloading: true,
      },
    },
  });
