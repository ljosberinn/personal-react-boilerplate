import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { RequestHandler, NextHandler } from 'next-connect';
import passport, { AuthenticateOptions } from 'passport';
import { Profile } from 'passport';

import { Provider } from '../../client/context/AuthContext/AuthContext';
import { UNAUTHORIZED } from '../../utils/statusCodes';
import { SESSION_COOKIE_NAME } from './authConstants';
import { getSession } from './cookie';
import { github, google, local } from './provider';

[github, google, local].forEach(provider => passport.use(provider));

export const authMiddleware = nextConnect()
  .use((passport.initialize() as unknown) as RequestHandler)
  .use(passport.session());

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  [SESSION_COOKIE_NAME]: Partial<Profile>;
}

export const protectedResourceMiddleware = (() => {
  const error = 'You must be authorized to access this resource.';

  const protection = async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
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
    Object.defineProperty(req, SESSION_COOKIE_NAME, {
      value: session,
      writable: false,
    });

    next();
  };

  return nextConnect().use(protection);
})();

export interface RawResponse extends Profile {
  _json: string;
  _raw: object;
}

export const promisifyAuthentication = (
  method: Provider,
  req: NextApiRequest,
  res: NextApiResponse,
  options: AuthenticateOptions = {}
): Promise<RawResponse> =>
  new Promise((resolve, reject) => {
    const authenticationHandler = passport.authenticate(
      method,
      options,
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );

    authenticationHandler(req, res);
  });

export const getProfileData = (data: RawResponse): Profile => {
  const { _json, _raw, ...props } = data;

  return props;
};
