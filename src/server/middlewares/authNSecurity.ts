import { SESSION_COOKIE_NAME } from '../../../src/constants';
import { BAD_REQUEST, UNAUTHORIZED } from '../../utils/statusCodes';
import { getSession } from '../auth/cookie';
import type { AuthenticatedRequest } from '../auth/types';
import type { Middleware } from '../types';

const errors = {
  missingAuthentication: 'You must be authorized to access this resource.',
  invalidBody: 'Malformed payload.',
};

type Response = { error: string };
type Request = AuthenticatedRequest;

/**
 * Authorization Middleware ensuring the request is authenticated via
 * `SESSION_COOKIE_NAME`.
 *
 * Bails with `401 - UNAUTHORIZED` if not.
 *
 * Patches `req`, adding property `SESSION_COOKIE_NAME` with the decrypted
 * cookie.
 */
export const authNSecurityMiddleware: Middleware<Response, Request> = (
  req,
  res,
  next
) => {
  try {
    // verify & decrypt the cookie
    const session = getSession(req);

    if (!session) {
      res.status(UNAUTHORIZED).json({ error: errors.missingAuthentication });
      return;
    }

    if (req[SESSION_COOKIE_NAME]) {
      res.status(BAD_REQUEST).json({ error: errors.invalidBody });
    }

    req[SESSION_COOKIE_NAME] = session;

    next();
  } catch {
    res.status(UNAUTHORIZED).json({ error: errors.missingAuthentication });
  }
};
