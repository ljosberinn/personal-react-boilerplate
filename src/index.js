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
} else {
  if (!localStorage['gotrue.user']) {
    const user = {
      url: process.env.REACT_APP_SITE_URL,
      token: {
        access_token: '',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'pYDomuTz1CtXErmnyV28wg',
        expires_at: 1576380881000,
      },
      id: '12345678-1234-1234-1234-1234567890123',
      aud: '',
      role: '',
      email: 'foo@bar.baz',
      confirmed_at: '2019-12-15T02:34:39Z',
      confirmation_sent_at: '2019-12-15T02:33:58Z',
      app_metadata: { provider: 'email' },
      user_metadata: {},
      created_at: '2019-12-15T02:33:58Z',
      updated_at: '2019-12-15T02:33:58Z',
    };

    //localStorage['gotrue.user'] = JSON.stringify(user);
  }
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
}

render(
  <StrictMode>
    <ThemeProvider>
      <ServiceWorkerProvider>
        <IdentityContextProvider url={SITE_URL} onAuthChange={identifyUser}>
          <Router>
            <App />
          </Router>
        </IdentityContextProvider>
      </ServiceWorkerProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root'),
);
