import nextConnect from 'next-connect';

import { SESSION_COOKIE_NAME } from '../../../constants';
import { OK } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import { removeCookie } from '../cookie';

type Request = {
  query: {
    authRouter: string[];
  };
};

const useLogout: RequestHandler<undefined, Request> = (
  { query: { authRouter } },
  res,
  next
) => {
  const [action] = authRouter;

  if (action === 'logout') {
    removeCookie(SESSION_COOKIE_NAME, res);

    res.status(OK).end();
    return;
  }

  next();
};

export const logoutHandler = nextConnect().delete(useLogout);
