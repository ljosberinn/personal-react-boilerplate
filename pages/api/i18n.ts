import { readdirSync, readFileSync } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { I18nextResourceLocale, I18nextResources } from 'src/client/i18n';
import { ENABLED_LANGUAGES } from 'src/constants';
import { FORBIDDEN, BAD_REQUEST } from 'utils/statusCodes';

export type i18nResponse = undefined | I18nextResourceLocale;

const readJSON = (path: string) =>
  JSON.parse(readFileSync(path, { encoding: 'utf8' }));

const i18nCache = ENABLED_LANGUAGES.reduce<I18nextResources>(
  (carry, language) => {
    const folder = `locales/${language}`;

    carry[language] = readdirSync(folder).reduce<I18nextResourceLocale>(
      (language, fileName) => {
        const [namespace] = fileName.split('.json');

        language[namespace] = readJSON(`${folder}/${fileName}`);

        return language;
      },
      {}
    );

    return carry;
  },
  {}
);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<I18nextResourceLocale>
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
