import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import BackendAdapter from 'i18next-multiload-backend-adapter';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

import { ENABLED_LANGUAGES } from './constants/env';

i18n
  .use(Backend)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed with react
    },
    load: 'languageOnly',
    detection: {
      lookupLocalStorage: 'languagePreference', // key to store in
      caches: ['localStorage'], // where to cache
      order: ['localStorage', 'navigator'], // in which order to search for a language
    },
    backend: {
      backends: [
        LocalStorageBackend,
        new BackendAdapter(null, {
          backend: new XHR(null, {
            loadPath: '/.netlify/functions/geti18n?lng={{lng}}&ns={{ns}}',
            addPath:
              '/.netlify/functions/addi18n?language={{lng}}&namespace={{ns}}',
            allowMultiloading: true,
            parsePayload: (namespace, key, fallbackValue) => ({
              key: fallbackValue || '',
            }),
          }),
        }),
      ], // order defines lookup pattern
      backendOptions: [
        {
          prefix: 'i18n-',
          expirationTime: 28 * 24 * 60 * 60 * 1000,
        },
        {},
      ],
    },
    ns: [], // removes 'translation' default key from backend query,
    defaultNS: [],
    whitelist: ENABLED_LANGUAGES,
    saveMissing: true,
  });
