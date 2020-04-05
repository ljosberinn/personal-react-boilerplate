import { createMemoryHistory } from 'history';
import React, { PropsWithChildren } from 'react';

import { INDEX, DASHBOARD } from '..';
import {
  Auth0Context,
  Auth0ContextDefinition,
} from '../../context/Auth0Context/Auth0Context';
import { render } from '../../testUtils';
import AuthAwareRedirect from './AuthAwareRedirect';

describe('<AuthAwareRedirect />', () => {
  const makeWrapper = (partial?: Partial<Auth0ContextDefinition>) => ({
    children,
  }: PropsWithChildren<{}>) => {
    const value = {
      loginWithPopup: jest.fn(),
      logout: jest.fn(),
      handleRedirectCallback: jest.fn(),
      getIdTokenClaims: jest.fn(),
      loginWithRedirect: jest.fn(),
      getTokenSilently: jest.fn(),
      getTokenWithPopup: jest.fn(),
      isPopupOpen: false,
      isAuthenticated: false,
      isInitializing: false,
      user: undefined,
      ...partial,
    };

    return (
      <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>
    );
  };

  it('should render without crashing', () => {
    render(<AuthAwareRedirect />, {
      wrapper: makeWrapper(),
    });
  });

  it('should redirect to INDEX if logged out', () => {
    const history = createMemoryHistory({
      initialEntries: ['/some-fake-route'],
    });

    render(<AuthAwareRedirect />, {
      history,
      wrapper: makeWrapper({ isAuthenticated: false }),
    });

    expect(history.location.pathname).toBe(INDEX.path.router);
    expect(history.action).toBe('REPLACE');
  });

  it('should redirect to DASHBOARD if logged out', () => {
    const history = createMemoryHistory({
      initialEntries: ['/some-fake-route'],
    });

    render(<AuthAwareRedirect />, {
      history,
      wrapper: makeWrapper({ isAuthenticated: true }),
    });

    expect(history.location.pathname).toBe(DASHBOARD.path.router);
    expect(history.action).toBe('REPLACE');
  });
});
