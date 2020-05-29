import session, { SessionOptions } from 'express-session';
import nextConnect, { RequestHandler, Middleware } from 'next-connect';
import passport from 'passport';

import { TOKEN_SECRET } from '../env';

const sessionOptions: SessionOptions = {
  resave: false,
  saveUninitialized: false,
  secret: TOKEN_SECRET,
};

const passportMiddleware: Middleware = nextConnect()
  .use((passport.initialize() as unknown) as RequestHandler)
  .use(passport.session())
  // required exclusively for twitter
  .use((session(sessionOptions) as unknown) as RequestHandler);

export default passportMiddleware;
