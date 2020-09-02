// import { Debug } from '@sentry/integrations';
import type {
  init as nodeInit,
  NodeOptions,
  configureScope,
} from '@sentry/node';
import type { init as browserInit, BrowserOptions } from '@sentry/react';
import type { Options } from '@sentry/types';

import {
  BUILD_TIME,
  IS_BROWSER,
  IS_PROD,
  SENTRY_DSN,
} from '../../../src/constants';

export const defaultOptions: Options = {
  attachStacktrace: true,
  dsn: SENTRY_DSN,
  enabled: true,
  maxBreadcrumbs: 50,
};

type BootParameters = {
  init: typeof browserInit | typeof nodeInit;
  options: NodeOptions | BrowserOptions;
  configureScope: typeof configureScope;
};

export const isomorphicSentryInit = ({
  init,
  options,
  configureScope,
}: BootParameters): void => {
  if (!IS_PROD) {
    options.beforeSend = () => null;
    // options.integrations = [
    //   new Debug({
    //     // set to true if you want to use `debugger;` instead
    //     debugger: false,
    //   }),
    // ];
  }

  init(options);

  configureScope((scope) => {
    scope.setTag('buildTime', BUILD_TIME);

    if (!IS_BROWSER) {
      scope.setTag('nodejs', process.version);
    }
  });
};
