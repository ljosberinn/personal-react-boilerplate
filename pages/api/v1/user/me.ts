import nextConnect from 'next-connect';

import type { User } from '../../../../src/client/context/AuthContext/AuthContext';
import { SESSION_COOKIE_NAME } from '../../../../src/constants';
import type { AuthenticatedRequest } from '../../../../src/server/auth/types';
import {
  sentryMiddleware,
  authNSecurityMiddleware,
} from '../../../../src/server/middlewares';
import type { RequestHandler } from '../../../../src/server/types';

const meHandler: RequestHandler<AuthenticatedRequest, User> = (req, res) => {
  return res.json(req[SESSION_COOKIE_NAME]);
};

// eslint-disable-next-line import/no-default-export
export default nextConnect()
  .use(sentryMiddleware)
  .use(authNSecurityMiddleware)
  .get(meHandler);
