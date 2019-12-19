import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from './context';
import './i18n';
import { IdentityContextProvider } from 'react-netlify-identity';
import * as Sentry from '@sentry/browser';

if (process.env.NODE_ENV === 'development') {
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

    localStorage['gotrue.user'] = JSON.stringify(user);
  }
} else {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

render(
  <StrictMode>
    <IdentityContextProvider url={process.env.REACT_APP_SITE_URL}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </IdentityContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);

serviceWorker.unregister();
