import { RequestHandler } from 'next-connect';

import { SESSION_COOKIE_NAME } from '../../../constants';
import { OK } from '../../../utils/statusCodes';
import { removeCookie } from '../cookie';

const logoutHandler: RequestHandler = (
  { query: { authRouter } },
  res,
  next
) => {
  const [action] = authRouter;

  if (action === 'logout') {
    removeCookie(SESSION_COOKIE_NAME, res);

    return res.status(OK).end();
  }

  next();
};

export default logoutHandler;
