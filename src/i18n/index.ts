import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';

// European languages — mocked (fall back to English content for now)
const mockedLangs = ['fr', 'es', 'it', 'nl', 'pt', 'pl', 'sv', 'da'];

const resources: Record<string, { translation: typeof enTranslation }> = {
  en: { translation: enTranslation },
  de: { translation: deTranslation },
};
mockedLangs.forEach(code => {
  resources[code] = { translation: enTranslation };
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', ...mockedLangs],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
