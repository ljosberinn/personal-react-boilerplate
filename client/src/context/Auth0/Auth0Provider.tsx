// taken from https://github.com/tommedema/startup-boilerplate/blob/master/packages/react-app/src/lib/auth0.tsx
import createAuth0Client, {
  Auth0ClientOptions,
  RedirectLoginResult,
  PopupLoginOptions,
  RedirectLoginOptions,
  GetTokenSilentlyOptions,
  LogoutOptions,
  getIdTokenClaimsOptions,
  GetTokenWithPopupOptions,
} from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import React, { useState, useCallback } from 'react';
import { useEffectOnce } from 'react-use';

import { Auth0Context, Auth0User } from './context';

export interface Auth0RedirectState {
  targetUrl?: string;
}

interface Auth0ProviderOptions {
  children: React.ReactElement;
  onRedirectCallback(result: RedirectLoginResult): void;
}

export default function Auth0Provider({
  children,
  onRedirectCallback,
  ...initOptions
}: Auth0ProviderOptions & Auth0ClientOptions) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState<Auth0User>();
  const [auth0Client, setAuth0Client] = useState<Auth0Client>();

  useEffectOnce(() => {
    createAuth0Client(initOptions)
      .then(async auth0FromHook => {
        if (window.location.search.includes('code=')) {
          const { appState } = await auth0FromHook.handleRedirectCallback();
          onRedirectCallback(appState);
        }

        const authed = await auth0FromHook.isAuthenticated();

        if (authed) {
          const userProfile = await auth0FromHook.getUser();

          setIsAuthenticated(true);
          setUser(userProfile);
        }
        setAuth0Client(auth0FromHook);
      })
      .finally(() => setIsInitializing(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps ,
  });

  const loginWithPopup = useCallback(
    async (options?: PopupLoginOptions) => {
      setIsPopupOpen(true);

      try {
        await auth0Client!.loginWithPopup(options);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPopupOpen(false);
      }

      const userProfile = await auth0Client!.getUser();
      setUser(userProfile);
      setIsAuthenticated(true);
    },
    [auth0Client]
  );

  const handleRedirectCallback = useCallback(async () => {
    setIsInitializing(true);

    const result = await auth0Client!.handleRedirectCallback();
    const userProfile = await auth0Client!.getUser();

    setIsInitializing(false);
    setIsAuthenticated(true);
    setUser(userProfile);

    return result;
  }, [auth0Client]);

  const loginWithRedirect = useCallback(
    (options?: RedirectLoginOptions) => auth0Client!.loginWithRedirect(options),
    [auth0Client]
  );

  const getTokenSilently = useCallback(
    (options?: GetTokenSilentlyOptions) =>
      auth0Client!.getTokenSilently(options),
    [auth0Client]
  );

  const logout = useCallback(
    (options?: LogoutOptions) => auth0Client!.logout(options),
    [auth0Client]
  );

  const getIdTokenClaims = useCallback(
    (options?: getIdTokenClaimsOptions) =>
      auth0Client!.getIdTokenClaims(options),
    [auth0Client]
  );

  const getTokenWithPopup = useCallback(
    (options?: GetTokenWithPopupOptions) =>
      auth0Client!.getTokenWithPopup(options),
    [auth0Client]
  );

  if (isInitializing) {
    return null;
  }

  return (
    <Auth0Context.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        isPopupOpen,
        loginWithPopup,
        loginWithRedirect,
        logout,
        getTokenSilently,
        handleRedirectCallback,
        getIdTokenClaims,
        getTokenWithPopup,
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
}
