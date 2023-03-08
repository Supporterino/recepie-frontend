import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import search_en from '../translation/en/search.json';
import common_en from '../translation/en/common.json';
import settings_en from '../translation/en/settings.json';
import search_de from '../translation/de/search.json';
import common_de from '../translation/de/common.json';
import settings_de from '../translation/de/settings.json';
import language_en from '../translation/en/languages.json';
import language_de from '../translation/de/languages.json';
import signin_en from '../translation/en/signin.json';
import signin_de from '../translation/de/signin.json';
import signup_en from '../translation/en/signup.json';
import signup_de from '../translation/de/signup.json';
import passwordReset_en from '../translation/en/passwordReset.json';
import passwordReset_de from '../translation/de/passwordReset.json';
import navbar_en from '../translation/en/navbar.json';
import navbar_de from '../translation/de/navbar.json';
import create_en from '../translation/en/create.json';
import create_de from '../translation/de/create.json';
import verification_en from '../translation/en/verification.json';
import verification_de from '../translation/de/verification.json';
import user_en from '../translation/en/user.json';
import user_de from '../translation/de/user.json';
import lists_en from '../translation/en/lists.json';
import lists_de from '../translation/de/lists.json';
import recipe_en from '../translation/en/recipe.json';
import recipe_de from '../translation/de/recipe.json';

export const resources = {
    en: {
        common: common_en,
        search: search_en,
        settings: settings_en,
        language: language_en,
        signin: signin_en,
        signup: signup_en,
        passwordReset: passwordReset_en,
        navbar: navbar_en,
        create: create_en,
        verification: verification_en,
        user: user_en,
        lists: lists_en,
        recipe: recipe_en,
    },
    de: {
        common: common_de,
        search: search_de,
        settings: settings_de,
        language: language_de,
        signin: signin_de,
        signup: signup_de,
        passwordReset: passwordReset_de,
        navbar: navbar_de,
        create: create_de,
        verification: verification_de,
        user: user_de,
        lists: lists_de,
        recipe: recipe_de,
    },
};

export type availableLanguagesType = keyof typeof resources;
export const availableLanguages = Object.keys(resources);
export const defaultNS = 'common';

i18next.use(initReactI18next).init({
    interpolation: { escapeValue: false }, // React already does escaping
    lng: 'en',
    resources,
    defaultNS,
    fallbackLng: 'en',
});

export default i18next;
