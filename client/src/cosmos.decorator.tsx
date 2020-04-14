import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import React, { Suspense, ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Router } from 'react-router-dom';

import history from './constants/history';
import { Auth0Context, Auth0ContextDefinition } from './context/Auth0/context';
import { NavigationProvider } from './context/Navigation';
import i18n from './testUtils/i18n';

const extractAuth0Partial = (
  dirtyChildren: ReactElement
): {
  auth0Partial: Partial<Auth0ContextDefinition>;
  children: ReactElement;
} => {
  const { auth0Partial, ...props } = dirtyChildren.props.children.props;

  return {
    auth0Partial,
    children: {
      ...dirtyChildren,
      props: {
        ...dirtyChildren.props,
        children: {
          ...dirtyChildren.props.children,
          props,
        },
      },
    },
  };
};

export default ({ children }: { children: ReactElement }) => {
  const { auth0Partial, children: sanitizedChildren } = extractAuth0Partial(
    children
  );

  return (
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
                // @ts-expect-error
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
                ...auth0Partial,
              }}
            >
              <NavigationProvider>
                <Suspense fallback={null}>{sanitizedChildren}</Suspense>
              </NavigationProvider>
            </Auth0Context.Provider>
          </Router>
        </I18nextProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
