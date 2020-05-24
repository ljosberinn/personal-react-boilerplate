import nextConnect from 'next-connect';

import { encryptSession, setTokenCookie } from '../../../server/auth/cookie';
import {
  promisifyAuthentication,
  authMiddleware,
} from '../../../server/auth/middleware';
import { OK, UNAUTHORIZED } from '../../../utils/statusCodes';

export default nextConnect()
  .use(authMiddleware)
  .post(async (req, res) => {
    try {
      const user = await promisifyAuthentication('local', req, res);
      const token = await encryptSession(user);

      setTokenCookie(res, token);

      res.status(OK).end();
    } catch (error) {
      console.error(error);
      res.status(UNAUTHORIZED).end();
    }
  });
