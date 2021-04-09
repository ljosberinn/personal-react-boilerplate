import { RewriteFrames } from '@sentry/integrations';
import { init, configureScope } from '@sentry/node';
import type { IncomingMessage } from 'http';
import type { NextApiRequest } from 'next';

import { SENTRY_SERVER_ROOT_DIR } from '../../constants';
import { isomorphicSentryInit, defaultOptions as options } from './shared';

export * from '@sentry/node';

const integrations = [
  // For Node.js, rewrite Error.stack to use relative paths, so that source
  // maps starting with ~/_next map to files in Error.stack with path
  // app:///_next
  new RewriteFrames({
    iteratee: (frame) => {
      frame.filename = frame.filename?.replace(
        SENTRY_SERVER_ROOT_DIR,
        'app:///'
      );

      frame.filename = frame.filename?.replace('.next', '_next');

      return frame;
    },
  }),
];

isomorphicSentryInit({ configureScope, init, options, integrations });

/**
 * Attaches lambda request data to Sentry
 */
export const attachLambdaContext = (
  req: NextApiRequest | IncomingMessage
): void => {
  configureScope((scope) => {
    scope.setTag('nodejs', process.version);
    scope.setTag('host', req.headers.host ?? '');
    scope.setTag('url', req.url ?? '');
    scope.setTag('method', req.method ?? '');
    scope.setContext('headers', req.headers);

    if ('query' in req) {
      scope.setContext('query', req.query);
      scope.setContext('cookies', req.cookies);
    }
  });
};
