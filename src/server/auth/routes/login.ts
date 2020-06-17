import { RequestHandler } from 'next-connect';

import { NOT_FOUND, OK, UNAUTHORIZED } from '../../../utils/statusCodes';
import { encryptSession, setSessionCookie } from '../cookie';
import { promisifyAuthentication } from '../utils';

const loginHandler: RequestHandler = async (req, res, next) => {
  const [action] = req.query.authRouter;

  if (action === 'login') {
    try {
      const user = await promisifyAuthentication('local', req, res);

      if (!user) {
        return res.status(NOT_FOUND).end();
      }

      const token = await encryptSession(user);

      setSessionCookie(token, res);

      return res.status(OK).json(user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return res.status(UNAUTHORIZED).end();
    }
  }

  next();
};

export default loginHandler;
