import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import i18nCache from '../../../locales';
import { I18nextResourceLocale } from '../../../src/client/i18n';
import { sentryMiddleware } from '../../../src/server/auth/middlewares';
import { FORBIDDEN, BAD_REQUEST } from '../../../src/utils/statusCodes';

export default nextConnect()
  .use(sentryMiddleware)
  .get(
    ({ query: { language } }, res: NextApiResponse<I18nextResourceLocale>) => {
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
  );
