// see https://github.com/andycmaj/nextjs-passport-session-auth/blob/master/lib/withPassport.ts
import cookieSession from 'cookie-session';
// @ts-expect-error
import redirect from 'micro-redirect';
import { NextApiResponse, NextApiRequest } from 'next';
import absoluteUrl from 'next-absolute-url';
import passport from 'passport';
import { Profile } from 'passport-github2';

import { github } from './provider';

export { default as passport } from 'passport';

passport.use(github);

passport.serializeUser((user: Profile, done) => {
  const { id, displayName, username, profileUrl } = user;

  done(null, { id, displayName, username, profileUrl });
});

passport.deserializeUser((serializedUser, done) => {
  if (!serializedUser) {
    return done(new Error(`User not found: ${serializedUser}`));
  }

  done(null, serializedUser);
});

const middleware = (fn: Function) => (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // @ts-expect-error
  if (!res.redirect) {
    // @ts-expect-error
    res.redirect = (location: string) => redirect(res, 302, location);
  }

  const { host } = absoluteUrl(req);

  const sessionHandler = cookieSession({
    name: 'passportSession',
    signed: false,
    domain: host,
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  });

  // @ts-expect-error
  sessionHandler(req, res, () => {
    const handler = passport.initialize();

    // @ts-expect-error
    handler(req, res, () => {
      const authenticatedHandler = passport.session();

      authenticatedHandler(req, res, () => fn(req, res));
    });
  });
};

export default middleware;
