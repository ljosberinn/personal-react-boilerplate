import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: require('./localization.json'), // todo: get from backend
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    detection: {
      lookupLocalStorage: 'languagePreference',
      caches: ['localStorage'],
      order: ['localStorage', 'navigator'],
    },
  });
