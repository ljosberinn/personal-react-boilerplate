import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { RequestHandler, NextHandler } from 'next-connect';
import passport, { AuthenticateOptions } from 'passport';
import { Profile } from 'passport';

import { Provider } from '../../client/context/AuthContext/AuthContext';
import { UNAUTHORIZED, BAD_REQUEST } from '../../utils/statusCodes';
import { SESSION_COOKIE_NAME } from './authConstants';
import { getSession } from './cookie';
import { github, google, local } from './provider';

[local, github, google].forEach(provider => passport.use(provider));

/**
 * Middleware accepting exclusively valid JSON as req.body, if existing
 */
const jsonMiddleware = nextConnect().use((req, res, next) => {
  if (req.body.length > 0) {
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      console.error(error);
      return res.status(BAD_REQUEST).end();
    }
  }

  next();
});

export const authMiddleware = nextConnect()
  .use((passport.initialize() as unknown) as RequestHandler)
  .use(passport.session())
  .use(jsonMiddleware);

export interface AuthenticatedNextApiRequest extends NextApiRequest {
  [SESSION_COOKIE_NAME]: Profile;
}

export const protectedResourceMiddleware = (() => {
  const error = 'You must be authorized to access this resource.';

  return nextConnect()
    .use(jsonMiddleware)
    .use(
      async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
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
      }
    );
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
          return reject(new Error(error));
        }

        resolve(token);
      }
    );

    authenticationHandler(req, res);
  });

export const getProfileData = (data: RawResponse): Profile => {
  const { _json, _raw, ...props } = data;

  return props;
};
