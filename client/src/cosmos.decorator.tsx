import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import React, { Suspense, PropsWithChildren } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Router } from 'react-router-dom';

import history from './constants/history';
import { Auth0Context } from './context/Auth0/context';
import { NavigationProvider } from './context/Navigation';
import i18n from './testUtils/i18n';

export default ({ children }: PropsWithChildren<{}>) => (
  <ThemeProvider>
    <CSSReset />
    <ColorModeProvider>
      <I18nextProvider i18n={i18n}>
        <Router history={history}>
          <Auth0Context.Provider
            value={{
              // @ts-expect-error
              loginWithPopup: () => {},
              logout: () => {},
              // @ts-expect-error
              handleRedirectCallback: () => {},
              getIdTokenClaims: () => {},
              // @ts-expect-error
              loginWithRedirect: () => {},
              // @ts-expect-error
              getTokenSilently: () => {},
              // @ts-expect-error
              getTokenWithPopup: () => {},
              isPopupOpen: false,
              isAuthenticated: false,
              isInitializing: false,
              user: undefined,
            }}
          >
            <NavigationProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </NavigationProvider>
          </Auth0Context.Provider>
        </Router>
      </I18nextProvider>
    </ColorModeProvider>
  </ThemeProvider>
);
