import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React, { Suspense, createContext as mockCreateContext } from 'react';
import { I18nextProvider, withTranslation } from 'react-i18next';
import { IdentityContextProvider } from 'react-netlify-identity';
import { Router } from 'react-router-dom';

import { SITE_URL } from '../constants/env';
import { ThemeProvider, NavigationProvider } from '../context';
import i18n from './testi18n';

const mockInstantlyResolvedPromise = () => Promise.resolve({});

jest.mock('react-netlify-identity', () => ({
  useIdentityContext: () => ({
    setSettings: jest.fn(),
    setUser: mockInstantlyResolvedPromise,
    signupUser: mockInstantlyResolvedPromise,
    loginUser: mockInstantlyResolvedPromise,
    logoutUser: mockInstantlyResolvedPromise,
    requestPasswordRecovery: mockInstantlyResolvedPromise,
    recoverAccount: mockInstantlyResolvedPromise,
    updateUser: mockInstantlyResolvedPromise,
    getFreshJWT: mockInstantlyResolvedPromise,
    authedFetch: {
      get: mockInstantlyResolvedPromise,
      post: mockInstantlyResolvedPromise,
      patch: mockInstantlyResolvedPromise,
      put: mockInstantlyResolvedPromise,
    },
    loginProvider: mockInstantlyResolvedPromise,
    acceptInviteExternalUrl: mockInstantlyResolvedPromise,
    isConfirmedUser: false,
    isLoggedIn: false,
    user: () => ({}),
    _url: '',
    verifyToken: '',
    param: {
      token: undefined,
      type: undefined,
      error: undefined,
      status: undefined,
    },
  }),
  IdentityContextProvider: ({ url, children }) => {
    const Context = mockCreateContext(null);

    return (
      <Context.Provider
        value={{
          setUser: mockInstantlyResolvedPromise,
          signupUser: mockInstantlyResolvedPromise,
          loginUser: mockInstantlyResolvedPromise,
          logoutUser: mockInstantlyResolvedPromise,
          requestPasswordRecovery: mockInstantlyResolvedPromise,
          recoverAccount: mockInstantlyResolvedPromise,
          updateUser: mockInstantlyResolvedPromise,
          getFreshJWT: mockInstantlyResolvedPromise,
          authedFetch: {
            get: mockInstantlyResolvedPromise,
            post: mockInstantlyResolvedPromise,
            patch: mockInstantlyResolvedPromise,
            put: mockInstantlyResolvedPromise,
          },
          loginProvider: mockInstantlyResolvedPromise,
          acceptInviteExternalUrl: mockInstantlyResolvedPromise,
          verifyToken: mockInstantlyResolvedPromise,
          isConfirmedUser: false,
          isLoggedIn: false,
          user: () => ({}),
          _url: url,
          param: {
            token: undefined,
            type: undefined,
            error: undefined,
            status: undefined,
          },
        }}
      >
        {children}
      </Context.Provider>
    );
  },
}));

export default function render(
  component,
  {
    route = '/',
    history = createMemoryHistory({
      initialEntries: [route],
    }),
  } = {},
) {
  const Component = withTranslation()(props => ({
    ...component,
    props: { ...component.props, ...props },
  }));

  function Wrapper({ children }) {
    return (
      <ThemeProvider>
        <Router history={history}>
          <IdentityContextProvider url={SITE_URL}>
            <I18nextProvider i18n={i18n}>
              <NavigationProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </NavigationProvider>
            </I18nextProvider>
          </IdentityContextProvider>
        </Router>
      </ThemeProvider>
    );
  }

  return {
    ...rtlRender(<Component />, {
      wrapper: Wrapper,
    }),
    history,
  };
}

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  class IntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserver,
  });
});
