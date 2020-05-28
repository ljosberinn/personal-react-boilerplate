import nextConnect from 'next-connect';

import { Provider } from '../../../../src/client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../../src/constants';
import {
  authMiddleware,
  promisifyAuthentication,
} from '../../../../src/server/auth/middlewares';
import {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../../../src/utils/statusCodes';

export default nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    const provider = req.query.provider as Provider;

    if (!provider || !ENABLED_PROVIDER.includes(provider)) {
      return res.status(NOT_FOUND).end();
    }

    try {
      await promisifyAuthentication(provider, req, res);
    } catch (error) {
      console.error(error);
      res.status(INTERNAL_SERVER_ERROR).end();
    }
  });
