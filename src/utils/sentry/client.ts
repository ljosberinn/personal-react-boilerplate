import { addBreadcrumb, Severity, init, configureScope } from '@sentry/react';
import type { BrowserOptions } from '@sentry/react';
import type { IncomingMessage } from 'http';
import type { NextRouter } from 'next/router';

import type { KarmaSSRProps } from '../../client/karma/SSR';
import { IS_BROWSER } from '../../constants';
import { isomorphicSentryInit, defaultOptions } from './shared';

export * from '@sentry/react';

const options: BrowserOptions = {
  ...defaultOptions,
};

isomorphicSentryInit({ configureScope, init, options });

type InitialContextArgs = Pick<KarmaSSRProps['auth'], 'session'> &
  Pick<KarmaSSRProps['i18n'], 'locale'> & {
    req?: IncomingMessage;
  };

/**
 * Attaches app boot data to Sentry
 */
export const attachInitialContext = ({
  req,
  locale,
  session,
}: InitialContextArgs): void => {
  addBreadcrumb({
    level: Severity.Debug,
    message: `Booting Karma (${IS_BROWSER ? 'in browser' : 'on server'})`,
  });

  configureScope((scope) => {
    scope.setExtra('locale', locale);

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
export const attachRoutingContext = ({
  route,
  pathname,
  query,
  asPath,
}: NextRouter): void => {
  configureScope((scope) => {
    scope.setContext('router', {
      asPath,
      pathname,
      query,
      route,
    });
  });
};
