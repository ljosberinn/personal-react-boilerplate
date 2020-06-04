import nextConnect from 'next-connect';

import {
  authNSecurityMiddleware,
  expectJSONBodyMiddleware,
} from '../../../../src/server/auth/middlewares';
import { AuthenticatedRequest } from '../../../../src/server/auth/types';

export default nextConnect()
  .use(authNSecurityMiddleware)
  .use(expectJSONBodyMiddleware)
  .get<AuthenticatedRequest>((req, res) => {
    res.json(req.session);
  });
