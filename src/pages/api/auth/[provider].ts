import nextConnect from 'next-connect';

import { Provider } from '../../../client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../constants';
import {
  authMiddleware,
  promisifyAuthentication,
} from '../../../server/auth/middlewares';
import { NOT_FOUND, BAD_REQUEST, CREATED } from '../../../utils/statusCodes';

export default nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    const provider = req.query.provider as Provider;

    if (!provider || !ENABLED_PROVIDER.includes(provider)) {
      res.status(NOT_FOUND).end();
    }

    await promisifyAuthentication(provider, req, res);

    res.end();
  })
  .post(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(BAD_REQUEST).end();
    }

    res.status(CREATED).end();
  });
