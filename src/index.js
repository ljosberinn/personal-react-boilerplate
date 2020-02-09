import { IdentityContextProvider } from 'react-netlify-identity';

import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { LOGROCKET_ID, SITE_URL, IS_LIVE } from './constants/env';
import { ThemeProvider, ServiceWorkerProvider } from './context';
import './i18n';
import './utils/errors';

if (IS_LIVE) {
  LogRocket.init(LOGROCKET_ID);
  setupLogRocketReact(LogRocket);
}

/**
 *
 * @param {import('react-netlify-identity').User} user
 */
function identifyUser(user) {
  if (!IS_LIVE) {
    return;
  }

  if (user) {
    const {
      id,
      confirmed_at,
      created_at,
      app_metadata: { provider },
    } = user;
    LogRocket.identify(id, {
      provider,
      created_at,
      confirmed_at,
    });

    return;
  }

  LogRocket.identify(null);
  window.location.pathname = '/';
}

render(
  <StrictMode>
    <ServiceWorkerProvider>
      <IdentityContextProvider url={SITE_URL} onAuthChange={identifyUser}>
        <ThemeProvider>
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </IdentityContextProvider>
    </ServiceWorkerProvider>
  </StrictMode>,
  document.getElementById('root'),
);
