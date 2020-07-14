import { Debug } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import { IncomingMessage } from 'http';
import { NextApiRequest } from 'next';
import { NextRouter } from 'next/router';

import { AppRenderProps } from '../../pages/_app';
import { SENTRY_DSN, IS_PROD, IS_BROWSER } from '../constants';

export { ErrorBoundary } from '@sentry/react';

const { init, configureScope, addBreadcrumb, Severity } = Sentry;

const sentryOptions: Sentry.NodeOptions = {
  attachStacktrace: true,
  dsn: SENTRY_DSN,
  enabled: true,
  maxBreadcrumbs: 50,
};

if (!IS_PROD) {
  // don't actually send the errors to Sentry
  sentryOptions.beforeSend = () => null;

  sentryOptions.integrations = [
    new Debug({
      // set to true if you want to use `debugger;` instead
      debugger: false,
    }),
  ];
}

init(sentryOptions);

configureScope(scope => {
  scope.setTag('nodejs', process.version);
  scope.setTag('buildTime', process.env.BUILD_TIME!);
});

/**
 * Attaches lambda request data to Sentry
 */
export const attachLambdaContext = (req: NextApiRequest) => {
  configureScope(scope => {
    scope.setTag('host', req.headers.host || '');
    scope.setTag('url', req.url || '');
    scope.setTag('method', req.method || '');
    scope.setContext('query', req.query);
    scope.setContext('cookies', req.cookies);
    scope.setContext('body', req.body);
    scope.setContext('headers', req.headers);
  });
};

interface InitialContextArgs
  extends Omit<AppRenderProps['pageProps'], 'i18nBundle'> {
  req?: IncomingMessage;
}

/**
 * Attaches app boot data to Sentry
 */
export const attachInitialContext = ({
  req,
  language,
  session,
  initialColorMode,
}: InitialContextArgs) => {
  addBreadcrumb({
    level: Severity.Debug,
    message: `Booting (${IS_BROWSER ? 'in browser' : 'on server'})`,
  });

  configureScope(scope => {
    scope.setExtra('language', language);
    scope.setExtra('initialColorMode', initialColorMode);

    if (req) {
      scope.setContext('headers', req.headers);
    }

    if (session) {
      scope.setContext('session', session);
    }
  });
};

/**
 * Attaches routing data to Sentry
 *
 * @see https://github.com/UnlyEd/next-right-now/blob/v1-ssr-mst-aptd-gcms-lcz-sty/src/pages/_app.tsx#L158
 */
export const attachRoutingContext = (
  { route, pathname, query, asPath }: NextRouter,
  name: string = 'unknown'
) => {
  configureScope(scope => {
    scope.setContext('router', {
      asPath,
      pathname,
      query,
      route,
    });
  });

  // in prod, this will make components show up with their minified name!
  attachComponentBreadcrumb(name);
};

export const attachComponentBreadcrumb = (name: string) => {
  addBreadcrumb({
    level: Severity.Debug,
    message: `Preparing "${name}" (${IS_BROWSER ? 'in browser' : 'on server'})`,
  });
};
