import type { BrowserOptions } from '@sentry/react';
import { addBreadcrumb, Severity, init, configureScope } from '@sentry/react';
import type { IncomingMessage } from 'http';
import type { NextRouter } from 'next/router';

import { IS_BROWSER } from '../../../src/constants';
import type { KarmaProps } from '../../client/Karma';
import { isomorphicSentryInit, defaultOptions } from './shared';

export * from '@sentry/react';

const options: BrowserOptions = {
  ...defaultOptions,
};

isomorphicSentryInit({ configureScope, init, options });

interface InitialContextArgs
  extends Omit<KarmaProps, 'i18nBundle' | 'cookies' | 'children'> {
  req?: IncomingMessage;
}

/**
 * Attaches app boot data to Sentry
 */
export const attachInitialContext = ({
  req,
  language,
  session,
}: InitialContextArgs): void => {
  addBreadcrumb({
    level: Severity.Debug,
    message: `Booting Karma (${IS_BROWSER ? 'in browser' : 'on server'})`,
  });

  configureScope((scope) => {
    scope.setExtra('language', language);

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
  name = 'unknown'
): void => {
  configureScope((scope) => {
    scope.setContext('router', {
      asPath,
      pathname,
      query,
      route,
    });
  });

  // in prod, this will make components show up with their minified name!
  // however, those names seem to match with the react devtools
  attachComponentBreadcrumb(name);
};

export const attachComponentBreadcrumb = (name: string): void => {
  addBreadcrumb({
    level: Severity.Debug,
    message: `Preparing "${name}" (${IS_BROWSER ? 'in browser' : 'on server'})`,
  });
};
