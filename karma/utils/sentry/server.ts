import { init, configureScope } from '@sentry/node';
import type { IncomingMessage } from 'http';
import type { NextApiRequest } from 'next';

import { isomorphicSentryInit, defaultOptions as options } from './shared';

export * from '@sentry/node';

isomorphicSentryInit({ configureScope, init, options });

/**
 * Attaches lambda request data to Sentry
 */
export const attachLambdaContext = (
  req: NextApiRequest | IncomingMessage
): void => {
  configureScope((scope) => {
    scope.setTag('host', req.headers.host ?? '');
    scope.setTag('url', req.url ?? '');
    scope.setTag('method', req.method ?? '');
    scope.setContext('headers', req.headers);

    if ('query' in req) {
      scope.setContext('query', req.query);
      scope.setContext('cookies', req.cookies);
      scope.setContext('body', req.body);
    }
  });
};
