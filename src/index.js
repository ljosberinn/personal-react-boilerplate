import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { IdentityContextProvider } from 'react-netlify-identity';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from './context';
import './i18n';
import { LOGROCKET_ID, SITE_URL, IS_LIVE } from './constants/env';
import './utils/errors';

if (!IS_LIVE) {
  if (!localStorage['gotrue.user']) {
    /*
   const user = {
      url: env.SITE_URL,
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

    localStorage['gotrue.user'] = JSON.stringify(user);
    */
  }
} else {
  //Sentry.init({ dsn: SENTRY_DSN });
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
    <IdentityContextProvider url={SITE_URL} onAuthChange={identifyUser}>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </IdentityContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);

serviceWorker.register();
