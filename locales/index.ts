import { I18nextResources, I18nextNamespace } from 'src/client/i18n';
import { ENABLED_LANGUAGES } from 'src/constants';

const praefixKeys = (praefix: string, keys: object) =>
  Object.entries(keys).reduce<I18nextNamespace>((carry, [key, value]) => {
    carry[`${praefix}.${key}`] = value;
    return carry;
  }, {});

const namespaces = ['common'];

const i18nCache: I18nextResources = ENABLED_LANGUAGES.reduce<I18nextResources>(
  (carry, language) => {
    carry[language] = namespaces.reduce(
      (carry, namespace) => ({
        ...carry,
        ...praefixKeys(namespace, require(`./${language}/${namespace}.json`)),
      }),
      {}
    );

    return carry;
  },
  {}
);

export default i18nCache;
