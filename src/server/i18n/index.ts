import { I18nextResources, I18nextResourceLocale } from '../../client/i18n';
import { ENABLED_LANGUAGES } from '../../constants';

export const namespaces = ['i18n', 'auth', 'theme', 'serviceWorker'];

export const i18nCache = ENABLED_LANGUAGES.reduce<I18nextResources>(
  (carry, language) => {
    carry[language] = namespaces.reduce<I18nextResourceLocale>(
      (carry, namespace) => {
        carry[namespace] = require(`./locales/${language}/${namespace}.json`);
        return carry;
      },
      {}
    );

    return carry;
  },
  {}
);
