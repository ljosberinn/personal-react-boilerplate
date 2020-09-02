import nextConnect from 'next-connect';

import type { User } from '../../../../karma/client/context/AuthContext/AuthContext';
import type { AuthenticatedRequest } from '../../../../karma/server/auth/types';
import {
  sentryMiddleware,
  authNSecurityMiddleware,
} from '../../../../karma/server/middlewares';
import type { RequestHandler } from '../../../../karma/server/types';
import { SESSION_COOKIE_NAME } from '../../../../src/constants';

const meHandler: RequestHandler<AuthenticatedRequest, User> = (req, res) => {
  return res.json(req[SESSION_COOKIE_NAME]);
};

// eslint-disable-next-line import/no-default-export
export default nextConnect()
  .use(sentryMiddleware)
  .use(authNSecurityMiddleware)
  .get(meHandler);
