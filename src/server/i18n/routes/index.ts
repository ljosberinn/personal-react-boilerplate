import nextConnect from 'next-connect';

import { I18nextResourceLocale } from '../../../../src/client/i18n';
import { ENABLED_LANGUAGES } from '../../../../src/constants';
import { i18nCache } from '../../../../src/server/i18n';
import { BAD_REQUEST } from '../../../../src/utils/statusCodes';
import { RequestHandler } from '../../types';

const useI18n: RequestHandler<{}, I18nextResourceLocale> = (
  { query: { language } },
  res
) => {
  const [nextLanguage] = language;

  if (
    !nextLanguage ||
    !ENABLED_LANGUAGES.includes(nextLanguage) ||
    Array.isArray(nextLanguage)
  ) {
    return res.status(BAD_REQUEST).end();
  }

  const data = i18nCache[nextLanguage];

  if (!data) {
    return res.status(BAD_REQUEST).end();
  }

  const json = JSON.stringify(data);

  res.setHeader('Content-Length', json.length);
  res.setHeader('Content-Type', 'application/json');

  return res.send(json);
};

export const i18nHandler = nextConnect().get(useI18n);
