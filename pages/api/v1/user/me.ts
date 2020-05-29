import nextConnect from 'next-connect';

import {
  authNSecurityMiddleware,
  expectJSONBodyMiddleware,
} from '../../../../src/server/auth/middlewares';
import { AuthenticatedRequest } from '../../../../src/server/auth/types';

export default nextConnect()
  .use(authNSecurityMiddleware)
  .use(expectJSONBodyMiddleware)
  // TODO: find better way for types here?
  // change if https://github.com/hoangvvo/next-connect/pull/57 gets accepted
  // .get<AuthenticatedRequest>(req, res) => {
  // @ts-expect-error
  .get((req: AuthenticatedRequest, res) => {
    res.json({ ...req.session });
  });
