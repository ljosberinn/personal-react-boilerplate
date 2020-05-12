import de_common from 'locales/de/common.json';
import en_common from 'locales/en/common.json';
import { NextApiRequest, NextApiResponse } from 'next';
import { I18nextResources, I18nextNamespace } from 'src/client/i18n';
import { FORBIDDEN, BAD_REQUEST } from 'utils/statusCodes';

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
  res: NextApiResponse<I18nextNamespace>
) {
  const { language, namespace } = req.query;

  if (!language || !namespace) {
    res.status(FORBIDDEN).end();
  }

  const data = i18nCache[language as string][namespace as string];

  if (!data) {
    res.status(BAD_REQUEST).end();
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(data);
}
