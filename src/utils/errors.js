import LogRocket from 'logrocket';

import { IS_LIVE } from '../constants/env';

let sessionUrlInitialized = false;

/**
 *
 * @param {Error} error
 */
const captureError = async error => {
  if (!IS_LIVE) {
    return;
  }

  const { logError, configureScope } = await import(
    /* webpackChunkName: "sentry" */ './sentry'
  );

  if (!sessionUrlInitialized) {
    sessionUrlInitialized = true;

    LogRocket.getSessionURL(sessionURL => {
      configureScope(scope => {
        scope.setExtra('sessionURL', sessionURL);
      });
    });
  }

  logError(error);
};

window.addEventListener('error', (message, url, line, column, error) => {
  captureError(error);
});

window.addEventListener('unhandledrejection', event => {
  captureError(event.reason);
});
