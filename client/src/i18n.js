import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector) // Detect the user's language
  .use(initReactI18next)  // Passes i18n down to React
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    fallbackLng: 'en',   // Default language
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
