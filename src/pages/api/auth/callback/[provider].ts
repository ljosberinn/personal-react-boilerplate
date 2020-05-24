import nextConnect from 'next-connect';

import { Provider } from '../../../../client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../../constants';
import { encryptSession, setTokenCookie } from '../../../../server/auth/cookie';
import {
  authMiddleware,
  promisifyAuthentication,
  getProfileData,
} from '../../../../server/auth/middlewares';
import {
  NOT_FOUND,
  FOUND_MOVED_TEMPORARILY,
  BAD_REQUEST,
} from '../../../../utils/statusCodes';

export default nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    const provider = req.query.provider as Provider;

    if (!provider || !ENABLED_PROVIDER.includes(provider)) {
      res.status(NOT_FOUND).end();
    }

    let errored = false;

    try {
      const user = await promisifyAuthentication(provider, req, res);
      const token = await encryptSession(getProfileData(user));

      setTokenCookie(res, token);
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
