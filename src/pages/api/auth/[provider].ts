import nextConnect from 'next-connect';

import { Provider } from '../../../client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../constants';
import {
  authMiddleware,
  promisifyAuthentication,
} from '../../../server/auth/middlewares';
import { NOT_FOUND, BAD_REQUEST, OK } from '../../../utils/statusCodes';

export default nextConnect()
  .use(authMiddleware)
  // redirect login route
  .get(async (req, res) => {
    const provider = req.query.provider as Provider;

    if (!provider || !ENABLED_PROVIDER.includes(provider)) {
      res.status(NOT_FOUND).end();
    }

    await promisifyAuthentication(provider, req, res);

    res.end();
  })
  // local login route
  .post(async (req, res) => {
    if (req.body.length === 0) {
      res.status(BAD_REQUEST).end();
    }

    // req.body might still be anything
    try {
      const { username, password } = JSON.parse(req.body);

      if (!username || !password) {
        res.status(BAD_REQUEST).end();
      }

      res.status(OK).end();
    } catch (error) {
      res.status(BAD_REQUEST).end();
    }
  });
