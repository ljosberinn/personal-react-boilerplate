import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider, AuthContext } from './context';

render(
  <StrictMode>
    <AuthContext>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthContext>
  </StrictMode>,
  document.getElementById('root'),
);

serviceWorker.unregister();
