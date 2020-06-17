import nextConnect, { RequestHandler, Middleware } from 'next-connect';
import passport from 'passport';

import { local, github, google, facebook, discord } from '../auth/provider';

[local, github, google, facebook, discord].forEach(provider =>
  passport.use(provider)
);

const passportMiddleware: Middleware = nextConnect()
  .use((passport.initialize() as unknown) as RequestHandler)
  .use(passport.session());

export default passportMiddleware;
