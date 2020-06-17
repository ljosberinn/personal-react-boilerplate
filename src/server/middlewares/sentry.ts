import { Middleware } from 'next-connect';

import { attachLambdaContext } from '../../utils/sentry';

/**
 * Middleware setting up sentry to process lambdas
 *
 * @see https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/utils/sentry.ts#L25
 */
const sentryMiddleware: Middleware = (req, _, next) => {
  attachLambdaContext(req);

  next();
};

export default sentryMiddleware;
