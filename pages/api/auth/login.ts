import nextConnect from 'next-connect';

import { Provider } from '../../../src/client/context/AuthContext/AuthContext';
import {
  encryptSession,
  setTokenCookie,
} from '../../../src/server/auth/cookie';
import {
  promisifyAuthentication,
  authMiddleware,
} from '../../../src/server/auth/middlewares';
import { OK, UNAUTHORIZED, NOT_FOUND } from '../../../src/utils/statusCodes';

const provider: Provider = 'local';

export default nextConnect()
  .use(authMiddleware)
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
