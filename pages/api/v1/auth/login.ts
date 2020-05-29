import nextConnect from 'next-connect';

import { promisifyAuthentication } from '../../../../src/client/utils/auth';
import {
  encryptSession,
  setTokenCookie,
} from '../../../../src/server/auth/cookie';
import {
  passportMiddleware,
  expectJSONBodyMiddleware,
} from '../../../../src/server/auth/middlewares';
import { OK, UNAUTHORIZED, NOT_FOUND } from '../../../../src/utils/statusCodes';
import '../../../../src/server/auth/passportSetup';

const provider = 'local';

export default nextConnect()
  .use(passportMiddleware)
  .use(expectJSONBodyMiddleware)
  .post(async (req, res) => {
    try {
      const user = await promisifyAuthentication(provider, req, res);

      if (!user) {
        return res.status(NOT_FOUND).end();
      }

      const token = await encryptSession(user);

      setTokenCookie(res, token);

      res.status(OK).json(user);
    } catch (error) {
      console.error(error);
      res.status(UNAUTHORIZED).end();
    }
  });
