import { init, captureException } from '@sentry/browser';

import { SENTRY_DSN } from '../constants/env';

init({
  dsn: SENTRY_DSN,
  integrations: integrations =>
    integrations.filter(integration => integration.name !== 'GlobalHandlers'),
});

export const logError = error => captureException(error);
