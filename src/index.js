import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from './context';
import './i18n';
import { IdentityContextProvider } from 'react-netlify-identity';

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
