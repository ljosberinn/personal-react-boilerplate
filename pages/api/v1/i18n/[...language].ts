import nextConnect from 'next-connect';

import { i18nGetHandler } from '../../../../src/server/i18n/routes';
import { sentryMiddleware } from '../../../../src/server/middlewares';

export default nextConnect().use(sentryMiddleware).get(i18nGetHandler);
