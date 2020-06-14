import nextConnect from 'next-connect';

import { ExternalProvider } from '../../../../src/client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../../src/constants';
import {
  passportMiddleware,
  sentryMiddleware,
} from '../../../../src/server/auth/middlewares';
import { promisifyAuthentication } from '../../../../src/server/auth/utils';
import {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../../../src/utils/statusCodes';
import '../../../../src/server/auth/passportSetup';

export default nextConnect()
  .use(sentryMiddleware)
  .use(passportMiddleware)
  .get(async (req, res) => {
    const provider = req.query.provider as ExternalProvider;

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
