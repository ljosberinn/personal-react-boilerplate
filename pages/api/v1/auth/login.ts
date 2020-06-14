import nextConnect from 'next-connect';

import {
  encryptSession,
  setSessionCookie,
} from '../../../../src/server/auth/cookie';
import {
  passportMiddleware,
  expectJSONBodyMiddleware,
  sentryMiddleware,
} from '../../../../src/server/auth/middlewares';
import { promisifyAuthentication } from '../../../../src/server/auth/utils';
import { OK, UNAUTHORIZED, NOT_FOUND } from '../../../../src/utils/statusCodes';
import '../../../../src/server/auth/passportSetup';

const provider = 'local';

export default nextConnect()
  .use(sentryMiddleware)
  .use(passportMiddleware)
  .use(expectJSONBodyMiddleware)
  .post(async (req, res) => {
    try {
      const user = await promisifyAuthentication(provider, req, res);

      if (!user) {
        return res.status(NOT_FOUND).end();
      }

      const token = await encryptSession(user);

      setSessionCookie(token, res);

      res.status(OK).json(user);
    } catch (error) {
      console.error(error);
      res.status(UNAUTHORIZED).end();
    }
  });
