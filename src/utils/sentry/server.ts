import { NodeOptions } from '@sentry/node';
import { init, configureScope } from '@sentry/node';
import { NextApiRequest } from 'next';

import { isomorphicSentryBoot, defaultOptions } from './shared';

const options: NodeOptions = {
  ...defaultOptions,
};

isomorphicSentryBoot({ configureScope, init, options });

/**
 * Attaches lambda request data to Sentry
 */
export const attachLambdaContext = (req: NextApiRequest) => {
  configureScope((scope) => {
    scope.setTag('host', req.headers.host || '');
    scope.setTag('url', req.url || '');
    scope.setTag('method', req.method || '');
    scope.setContext('query', req.query);
    scope.setContext('cookies', req.cookies);
    scope.setContext('body', req.body);
    scope.setContext('headers', req.headers);
  });
};
