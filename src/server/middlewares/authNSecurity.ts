import { Middleware } from 'next-connect';

import { SESSION_COOKIE_NAME } from '../../constants';
import { UNAUTHORIZED } from '../../utils/statusCodes';
import { getSession } from '../auth/cookie';
import { AuthenticatedRequest } from '../auth/types';

const error = 'You must be authorized to access this resource.';

/**
 * Authorization Middleware ensuring the request is authenticated via
 * `SESSION_COOKIE_NAME`.
 *
 * Bails with `401 - UNAUTHORIZED` if not.
 *
 * Patches `req`, adding property `SESSION_COOKIE_NAME` with the decrypted
 * cookie.
 */
const authNSecurityMiddleware: Middleware<AuthenticatedRequest> = async (
  req,
  res,
  next
) => {
  // bail instantly if no session cookie exists
  if (!req.cookies[SESSION_COOKIE_NAME]) {
    return res.status(UNAUTHORIZED).json({ error });
  }

  // verify & decrypt the cookie
  const session = await getSession(req);

  if (!session) {
    return res.status(UNAUTHORIZED).json({ error });
  }

  req[SESSION_COOKIE_NAME] = session;

  next();
};

export default authNSecurityMiddleware;
