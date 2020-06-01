import nextConnect, { RequestHandler, Middleware } from 'next-connect';
import passport from 'passport';

const passportMiddleware: Middleware = nextConnect()
  .use((passport.initialize() as unknown) as RequestHandler)
  .use(passport.session());

export default passportMiddleware;
