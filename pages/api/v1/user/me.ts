import nextConnect from 'next-connect';

import { SESSION_COOKIE_NAME } from '../../../../src/constants';
import { AuthenticatedRequest } from '../../../../src/server/auth/types';
import {
  authNSecurityMiddleware,
  sentryMiddleware,
} from '../../../../src/server/middlewares';

export default nextConnect()
  .use(sentryMiddleware)
  .use(authNSecurityMiddleware)
  .get<AuthenticatedRequest>((req, res) => {
    res.json(req[SESSION_COOKIE_NAME]);
  });
