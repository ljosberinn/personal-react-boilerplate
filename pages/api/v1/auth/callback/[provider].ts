import nextConnect from 'next-connect';

import { Provider } from '../../../../../src/client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../../../src/constants';
import {
  encryptSession,
  setSessionCookie,
} from '../../../../../src/server/auth/cookie';
import {
  passportMiddleware,
  sentryMiddleware,
} from '../../../../../src/server/auth/middlewares';
import {
  promisifyAuthentication,
  getProfileData,
} from '../../../../../src/server/auth/utils';
import {
  NOT_FOUND,
  FOUND_MOVED_TEMPORARILY,
  BAD_REQUEST,
} from '../../../../../src/utils/statusCodes';
import '../../../../../src/server/auth/passportSetup';

export default nextConnect()
  .use(sentryMiddleware)
  .use(passportMiddleware)
  .get(async (req, res) => {
    const provider = req.query.provider as Exclude<Provider, 'local'>;

    if (!provider || !ENABLED_PROVIDER.includes(provider)) {
      res.status(NOT_FOUND).end();
    }

    let errored = false;

    try {
      const user = await promisifyAuthentication(provider, req, res);
      const token = await encryptSession(getProfileData(user));

      setSessionCookie(token, res);
    } catch (error) {
      console.error(error);
      errored = true;
    }

    res
      .writeHead(errored ? BAD_REQUEST : FOUND_MOVED_TEMPORARILY, {
        Location: '/',
      })
      .end();
  });
