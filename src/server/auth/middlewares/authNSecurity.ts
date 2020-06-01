import { Middleware } from 'next-connect';

import { UNAUTHORIZED } from '../../../utils/statusCodes';
import { SESSION_COOKIE_NAME } from '../authConstants';
import { getSession } from '../cookie';

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
const authNSecurityMiddleware: Middleware = async (req, res, next) => {
  // bail instantly if no session cookie exists
  if (!req.cookies[SESSION_COOKIE_NAME]) {
    res.status(UNAUTHORIZED).json({ error });
  }

  // verify & decrypt the cookie
  const session = await getSession(req);

  if (!session) {
    res.status(UNAUTHORIZED).json({ error });
  }

  // patch req with decrypted session
  // TODO: change if https://github.com/hoangvvo/next-connect/pull/57 gets accepted
  // req[SESSION_COOKIE_NAME] = session;
  Object.defineProperty(req, SESSION_COOKIE_NAME, {
    value: session,
    writable: false,
  });

  next();
};

export default authNSecurityMiddleware;
