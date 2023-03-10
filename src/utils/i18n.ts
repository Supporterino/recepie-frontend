/* eslint-disable import/no-named-as-default-member */
/* eslint-disable canonical/filename-match-regex */
/* eslint-disable canonical/id-match */
import common_de from '../translation/de/common.json';
import create_de from '../translation/de/create.json';
import language_de from '../translation/de/languages.json';
import lists_de from '../translation/de/lists.json';
import navbar_de from '../translation/de/navbar.json';
import passwordReset_de from '../translation/de/passwordReset.json';
import recipe_de from '../translation/de/recipe.json';
import search_de from '../translation/de/search.json';
import settings_de from '../translation/de/settings.json';
import signin_de from '../translation/de/signin.json';
import signup_de from '../translation/de/signup.json';
import user_de from '../translation/de/user.json';
import verification_de from '../translation/de/verification.json';
import common_en from '../translation/en/common.json';
import create_en from '../translation/en/create.json';
import language_en from '../translation/en/languages.json';
import lists_en from '../translation/en/lists.json';
import navbar_en from '../translation/en/navbar.json';
import passwordReset_en from '../translation/en/passwordReset.json';
import recipe_en from '../translation/en/recipe.json';
import search_en from '../translation/en/search.json';
import settings_en from '../translation/en/settings.json';
import signin_en from '../translation/en/signin.json';
import signup_en from '../translation/en/signup.json';
import user_en from '../translation/en/user.json';
import verification_en from '../translation/en/verification.json';
import i18next from 'i18next';
import {
  initReactI18next,
} from 'react-i18next';

export const resources = {
  de: {
    common: common_de,
    create: create_de,
    language: language_de,
    lists: lists_de,
    navbar: navbar_de,
    passwordReset: passwordReset_de,
    recipe: recipe_de,
    search: search_de,
    settings: settings_de,
    signin: signin_de,
    signup: signup_de,
    user: user_de,
    verification: verification_de,
  },
  en: {
    common: common_en,
    create: create_en,
    language: language_en,
    lists: lists_en,
    navbar: navbar_en,
    passwordReset: passwordReset_en,
    recipe: recipe_en,
    search: search_en,
    settings: settings_en,
    signin: signin_en,
    signup: signup_en,
    user: user_en,
    verification: verification_en,
  },
};

export type availableLanguagesType = keyof typeof resources;
export const availableLanguages = Object.keys(resources);
export const defaultNS = 'common';

i18next.use(initReactI18next).init({
  defaultNS,
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
  // React already does escaping
  lng: 'en',
  resources,
});

export {
  default,
} from 'i18next';
