import nextConnect from 'next-connect';

import {
  protectedResourceMiddleware,
  AuthenticatedNextApiRequest,
} from '../../../src/server/auth/middlewares';

export default nextConnect()
  .use(protectedResourceMiddleware)
  // TODO: find better way for types here?
  // @ts-expect-error
  .get((req: AuthenticatedNextApiRequest, res) => {
    res.json(req.session);
  });
