import nextConnect from 'next-connect';

import { authMiddleware } from '../../../server/auth/middlewares';
import { BAD_REQUEST, CREATED } from '../../../utils/statusCodes';

export default nextConnect()
  .use(authMiddleware)
  .post((req, res) => {
    if (req.body.length === 0) {
      res.status(BAD_REQUEST).end();
    }

    const { username, password } = JSON.parse(req.body);

    if (!username || !password) {
      res.status(BAD_REQUEST).end();
    }

    // TODO: implement Profile interface here
    res.status(CREATED).end({ json: { username } });
  });
