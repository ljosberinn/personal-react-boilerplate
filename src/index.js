import React, { StrictMode, Suspense } from 'react';
import { render } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider, AuthContext } from './context';
import './i18n';

render(
  <Suspense fallback={null}>
    <StrictMode>
      <AuthContext>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthContext>
    </StrictMode>
  </Suspense>,
  document.getElementById('root'),
);

serviceWorker.unregister();
