import {
  I18nextResources,
  I18nextResourceLocale,
} from '../../../karma/client/i18n';
import { ENABLED_LANGUAGES } from '../../constants';
import { namespaces } from './namespaces';

export const i18nCache = ENABLED_LANGUAGES.reduce<I18nextResources>(
  (carry, language) => {
    carry[language] = namespaces.reduce<I18nextResourceLocale>(
      (carry, namespace) => {
        // eslint-disable-next-line import/no-dynamic-require
        carry[namespace] = require(`./locales/${language}/${namespace}.json`);
        return carry;
      },
      {}
    );

    return carry;
  },
  {}
);
