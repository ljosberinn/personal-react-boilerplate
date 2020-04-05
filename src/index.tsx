import { ThemeProvider, CSSReset, ColorModeProvider } from '@chakra-ui/core';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { ServiceWorker } from './components';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from './constants/env';
import history from './constants/history';
import {
  ServiceWorkerProvider,
  NavigationProvider,
  Auth0Provider,
} from './context';

import './i18n';

const onAuthRedirectCallback = (redirectResult?: RedirectLoginResult) => {
  console.log(
    'auth0 onRedirectCallback called with redirectState %o',
    redirectResult
  );

  // Clears auth0 query string parameters from url
  const targetUrl = redirectResult?.appState?.targetUrl
    ? redirectResult.appState.targetUrl
    : window.location.pathname;

  history.push(targetUrl);
};

render(
  <StrictMode>
    <ThemeProvider>
      <ColorModeProvider value="dark">
        <CSSReset />
        <ServiceWorkerProvider>
          <ServiceWorker />
        </ServiceWorkerProvider>
        <Router>
          <NavigationProvider>
            <Auth0Provider
              domain={AUTH0_DOMAIN}
              client_id={AUTH0_CLIENT_ID}
              redirect_uri={window.location.origin}
              onRedirectCallback={onAuthRedirectCallback}
            >
              <App />
            </Auth0Provider>
          </NavigationProvider>
        </Router>
      </ColorModeProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
