import i18nCache from 'locales';
import { NextApiRequest, NextApiResponse } from 'next';
import { I18nextResourceLocale } from 'src/client/i18n';
import { FORBIDDEN, BAD_REQUEST } from 'utils/statusCodes';

export default function handler(
  { query: { language } }: NextApiRequest,
  res: NextApiResponse<I18nextResourceLocale>
) {
  if (!language || Array.isArray(language)) {
    return res.status(FORBIDDEN).end();
  }

  const data = i18nCache[language];

  if (!data) {
    res.status(BAD_REQUEST).end();
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(data);
}
