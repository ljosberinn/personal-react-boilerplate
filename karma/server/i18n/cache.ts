import type {
  I18nextResources,
  I18nextResourceLocale,
} from '../../../karma/client/i18n';
import { ENABLED_LANGUAGES } from '../../../src/constants';

export const namespaces = ['i18n', 'auth', 'theme', 'serviceWorker'] as const;

export type Namespace = typeof namespaces[number];

export const i18nCache = ENABLED_LANGUAGES.reduce<I18nextResources>(
  (carry, language) => {
    carry[language] = namespaces.reduce<I18nextResourceLocale>(
      (carry, namespace) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-dynamic-require
        carry[namespace] = require(`./locales/${language}/${namespace}.json`);

        return carry;
      },
      {}
    );

    return carry;
  },
  {}
);
