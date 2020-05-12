import de_common from 'locales/de/common.json';
import en_common from 'locales/en/common.json';
import { NextApiRequest, NextApiResponse } from 'next';
import { I18nextResourceLocale, I18nextResources } from 'src/client/i18n';
import { FORBIDDEN, BAD_REQUEST } from 'utils/statusCodes';

export type i18nResponse = undefined | I18nextResourceLocale;

const i18nCache: I18nextResources = {
  de: {
    common: de_common,
  },
  en: {
    common: en_common,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | I18nextResourceLocale>
) {
  const { language, namespace } = req.query;

  if (!language || !namespace) {
    return res.status(FORBIDDEN);
  }

  const data = i18nCache[language as string][namespace as string];

  if (!data) {
    res.status(BAD_REQUEST).end();
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(data);
}
