import nextConnect from 'next-connect';

import { Provider } from '../../../client/context/AuthContext/AuthContext';
import { encryptSession, setTokenCookie } from '../../../server/auth/cookie';
import {
  promisifyAuthentication,
  authMiddleware,
} from '../../../server/auth/middlewares';
import { OK, UNAUTHORIZED, NOT_FOUND } from '../../../utils/statusCodes';

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
