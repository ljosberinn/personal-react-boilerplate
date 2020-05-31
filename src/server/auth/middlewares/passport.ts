import nextConnect, { RequestHandler, Middleware } from 'next-connect';
import { session, Options } from 'next-session';
import passport from 'passport';

const options: Options = {
  cookie: {
    maxAge: 120, // seconds; this cookie is only necessary for twitter auth
  },
};

const passportMiddleware: Middleware = nextConnect()
  .use((passport.initialize() as unknown) as RequestHandler)
  .use(passport.session())
  .use((session(options) as unknown) as RequestHandler);

export default passportMiddleware;
