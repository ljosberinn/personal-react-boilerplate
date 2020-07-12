import nextConnect from 'next-connect';

import { SESSION_COOKIE_NAME } from '../../../../src/constants';
import { AuthenticatedRequest } from '../../../../src/server/auth/types';
import {
  authNSecurityMiddleware,
  sentryMiddleware,
} from '../../../../src/server/middlewares';
import { RequestHandler } from '../../../../src/server/types';

const meHandler: RequestHandler<AuthenticatedRequest> = (req, res) => {
  return res.json(req[SESSION_COOKIE_NAME]);
};

// eslint-disable-next-line import/no-default-export
export default nextConnect()
  .use(sentryMiddleware)
  .use(authNSecurityMiddleware)
  .get(meHandler);
