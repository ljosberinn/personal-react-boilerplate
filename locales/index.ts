import { I18nextResources, I18nextResourceLocale } from '../src/client/i18n';
import { ENABLED_LANGUAGES } from '../src/constants';

export const namespaces = ['common', 'i18n', 'auth', 'theme'];

const i18nCache = ENABLED_LANGUAGES.reduce<I18nextResources>(
  (carry, language) => {
    carry[language] = namespaces.reduce<I18nextResourceLocale>(
      (carry, namespace) => {
        carry[namespace] = require(`./${language}/${namespace}.json`);
        return carry;
      },
      {}
    );

    return carry;
  },
  {}
);

export default i18nCache;
