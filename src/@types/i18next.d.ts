/* eslint-disable canonical/filename-match-regex */
import {
  type defaultNS,
  type resources,
} from '../utils/i18n';

declare module 'i18next' {
  type CustomTypeOptions = {
    defaultNS: typeof defaultNS,
    resources: typeof resources['en'],
  };
}
