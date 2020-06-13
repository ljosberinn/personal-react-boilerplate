import { Debug } from '@sentry/integrations';
import * as Sentry from '@sentry/node';

import { SENTRY_DSN, IS_PROD } from '../constants';

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

Sentry.init(sentryOptions);
