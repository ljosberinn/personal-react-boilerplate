import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(XHR)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      lookupLocalStorage: 'languagePreference',
      caches: ['localStorage'],
      order: ['localStorage', 'navigator'],
    },
    loadPath: '/.netlify/functions/index.js?lng={{lng}}&ns={{ns}}',
  });
