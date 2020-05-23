import cookieSession from 'cookie-session';
import { Request, Response } from 'express';
// @ts-expect-error
import redirect from 'micro-redirect';
import { NextApiResponse, NextApiRequest } from 'next';
import absoluteUrl from 'next-absolute-url';
import passport from 'passport';
import { Profile as GithubProfile } from 'passport-github2';

import { IS_PROD } from '../../constants';
import { FOUND_MOVED_TEMPORARILY } from '../../utils/statusCodes';
import { SESSION_COOKIE_NAME } from './constants';
import { github, google, isGithubProfile } from './provider';

export { default as passport } from 'passport';

passport.use(google);
passport.use(github);

type MaybeProfile = GithubProfile | object;

passport.serializeUser((user: MaybeProfile, done) => {
  if (isGithubProfile(user)) {
    const { id, displayName, username, profileUrl, photos } = user;

    done(null, { id, displayName, username, profileUrl, photos });
    return;
  }

  done(new Error('unknown provider'));
});

passport.deserializeUser((serializedUser, done) => {
  if (!serializedUser) {
    return done(new Error(`User not found: ${serializedUser}`));
  }

  done(null, serializedUser);
});

/**
 * Helper fn which might get extracted into a separate cookies.ts if needed.
 */
export const createSessionHandler = (
  req: NextApiRequest,
  options: CookieSessionInterfaces.CookieSessionOptions = {}
) => {
  const { host } = absoluteUrl(req);
  // localhost includes port, which isnt a valid cookie target
  const domain = IS_PROD ? host : host.split(':')[0];

  return cookieSession({
    domain,
    name: SESSION_COOKIE_NAME,
    secure: IS_PROD,
    maxAge: 8 * 60 * 60 * 1000,
    sameSite: true,
    signed: false,
    ...options,
  });
};

type ProviderHandler = (req: NextApiRequest, res: NextApiResponse) => void;

const middleware = (providerHandler: ProviderHandler) => (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // TS-friendly monkey patch NextApiResponse to support passports redirect
  if (!('redirect' in res)) {
    Object.defineProperty(res, 'redirect', {
      value: (location: string) =>
        redirect(res, FOUND_MOVED_TEMPORARILY, location),
      writable: false,
    });
  }

  const sessionHandler = createSessionHandler(req);

  // see https://github.com/andycmaj/nextjs-passport-session-auth/blob/master/lib/withPassport.ts
  sessionHandler(
    (req as unknown) as Request,
    (res as unknown) as Response,
    () => {
      const handler = passport.initialize();

      handler((req as unknown) as Request, (res as unknown) as Response, () => {
        const authenticatedHandler = passport.session();

        authenticatedHandler(req, res, () => providerHandler(req, res));
      });
    }
  );
};

export default middleware;
