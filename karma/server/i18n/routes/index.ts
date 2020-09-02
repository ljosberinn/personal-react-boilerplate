import nextConnect from 'next-connect';

import type { I18nextResourceLocale } from '../../../../karma/client/i18n';
import { ENABLED_LANGUAGES } from '../../../../src/constants';
import { BAD_REQUEST } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import type { Namespace } from '../cache';
import { i18nCache } from '../cache';

/**
 * Extracts the desired translation based on the next language and potentially
 * given namespaces.
 */
const getTranslation = (language: string, namespaces?: Namespace[]) => {
  if (namespaces && namespaces.length > 0) {
    return namespaces.reduce<I18nextResourceLocale>((carry, namespace) => {
      // code-wise, it cant ever be invalid unless you ignore TS
      // but the actual request is userland territory so anything could happen
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (i18nCache[language]?.[namespace]) {
        carry[namespace] = i18nCache[language][namespace];
      }

      return carry;
    }, {});
  }

  return i18nCache[language];
};

const useI18n: RequestHandler<
  { query: { namespaces: Namespace[] } },
  string
> = ({ query: { language, namespaces } }, res) => {
  const [nextLanguage] = language;

  if (
    !nextLanguage ||
    !ENABLED_LANGUAGES.includes(nextLanguage) ||
    Array.isArray(nextLanguage)
  ) {
    return res.status(BAD_REQUEST).end();
  }

  const json = JSON.stringify(getTranslation(nextLanguage, namespaces));

  if (!json || json.length === 2) {
    return res.status(BAD_REQUEST).end();
  }

  res.setHeader('Content-Length', json.length);
  res.setHeader('Content-Type', 'application/json');

  return res.send(json);
};

export const i18nHandler = nextConnect().get(useI18n);
