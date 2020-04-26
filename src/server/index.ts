import cookieParser from 'cookie-parser';
import express, { Request, Response, NextFunction } from 'express';
import next from 'next';
import uuidv4 from 'uuid/v4';

import setupSentry from '../../utils/sentry';

const port = parseInt(process.env.PORT!, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = app.getRequestHandler();

const sessionCookie = (req: Request, res: Response, next: NextFunction) => {
  const htmlPage =
    !req.path.match(/^\/(_next|static)/) &&
    !req.path.match(/\.(js|map)$/) &&
    req.accepts('text/html', 'text/css', 'image/png') === 'text/html';

  if (!htmlPage) {
    next();
    return;
  }

  if (!req.cookies.sid || req.cookies.sid.length === 0) {
    req.cookies.sid = uuidv4();
    res.cookie('sid', req.cookies.sid);
  }

  next();
};

const sourcemapsForSentryOnly = (token: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // In production we only want to serve source maps for Sentry
  if (!dev && !!token && req.headers['x-sentry-token'] !== token) {
    res
      .status(401)
      .send(
        'Authentication access token is required to access the source map.'
      );
    return;
  }

  next();
};

(async () => {
  await app.prepare();

  const {
    Sentry: { Handlers },
  } = setupSentry(app.buildId);

  express()
    .use(Handlers.requestHandler())
    .use(cookieParser())
    .use(sessionCookie)
    // This handles errors if they are thrown before reaching the app
    .use(Handlers.errorHandler())
    .get(/\.map$/, sourcemapsForSentryOnly(process.env.SENTRY_TOKEN!))
    .all('*', (req, res) => handler(req, res))

    .listen(port, (error: Error) => {
      if (error) {
        throw error;
      }
      // eslint-disable-next-line no-console
      console.log(`> Ready on http://localhost:${port}`);
    });
})();
