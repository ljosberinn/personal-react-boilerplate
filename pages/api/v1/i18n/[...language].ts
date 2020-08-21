import nextConnect from 'next-connect';

import { i18nHandler } from '../../../../karma/server/i18n/routes';
import { sentryMiddleware } from '../../../../karma/server/middlewares';

// eslint-disable-next-line import/no-default-export
export default nextConnect().use(sentryMiddleware).use(i18nHandler);
