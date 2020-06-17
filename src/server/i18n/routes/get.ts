import { NextApiResponse } from 'next';
import { RequestHandler } from 'next-connect';

import { I18nextResourceLocale } from '../../../../src/client/i18n';
import { ENABLED_LANGUAGES } from '../../../../src/constants';
import i18nCache from '../../../../src/server/i18n';
import { FORBIDDEN, BAD_REQUEST } from '../../../../src/utils/statusCodes';

const i18nGetHandler: RequestHandler = (
  { query: { language } },
  res: NextApiResponse<I18nextResourceLocale>
) => {
  const [nextLanguage] = language;

  if (
    !nextLanguage ||
    !ENABLED_LANGUAGES.includes(nextLanguage) ||
    Array.isArray(nextLanguage)
  ) {
    return res.status(FORBIDDEN).end();
  }

  const data = i18nCache[nextLanguage];

  if (!data) {
    return res.status(BAD_REQUEST).end();
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(data);
};

export default i18nGetHandler;
