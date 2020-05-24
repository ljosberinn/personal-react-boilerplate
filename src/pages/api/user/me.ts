import nextConnect from 'next-connect';

import {
  protectedResourceMiddleware,
  AuthenticatedNextApiRequest,
} from '../../../server/auth/middlewares';

export default nextConnect()
  .use(protectedResourceMiddleware)
  // TODO: find better way for types here?
  // @ts-expect-error
  .get(async (req: AuthenticatedNextApiRequest, res) => {
    res.json({ ...req.session });
  });
