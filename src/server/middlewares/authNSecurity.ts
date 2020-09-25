import { SESSION_COOKIE_NAME } from '../../../src/constants';
import { UNAUTHORIZED } from '../../utils/statusCodes';
import { getSession } from '../auth/cookie';
import type { AuthenticatedRequest } from '../auth/types';
import type { Middleware } from '../types';

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
export const authNSecurityMiddleware: Middleware<
  AuthenticatedRequest,
  { error: string }
> = (req, res, next) => {
  try {
    // verify & decrypt the cookie
    const session = getSession(req);

    if (!session) {
      return res.status(UNAUTHORIZED).json({ error });
    }

    req[SESSION_COOKIE_NAME] = session;

    next();
  } catch {
    return res.status(UNAUTHORIZED).json({ error });
  }
};
