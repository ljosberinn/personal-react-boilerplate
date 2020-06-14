import nextConnect from 'next-connect';

import { SESSION_COOKIE_NAME } from '../../../../src/constants';
import {
  authNSecurityMiddleware,
  sentryMiddleware,
} from '../../../../src/server/auth/middlewares';
import { AuthenticatedRequest } from '../../../../src/server/auth/types';

export default nextConnect()
  .use(sentryMiddleware)
  .use(authNSecurityMiddleware)
  .get<AuthenticatedRequest>((req, res) => {
    res.json(req[SESSION_COOKIE_NAME]);
  });
