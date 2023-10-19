import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from './en.json';
import welsh from './cy.json';

export const resources = {
  en: {
    translation: english,
  },
  cy: {
    translation: welsh,
  },
};

i18next.use(initReactI18next).init({
  lng: 'en',
  resources,
});
