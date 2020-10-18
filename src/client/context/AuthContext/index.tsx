import { useRouter } from 'next/router';
import type { SetStateAction, Dispatch } from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';

import { ENABLED_PROVIDER } from '../../../constants';
import { INTERNAL_SERVER_ERROR } from '../../../utils/statusCodes';
import type { WithChildren, KarmaMode } from '../../karma/types';
import type { User, LoginOptions, LocalLoginOptions } from './AuthContext';
import { AuthContext } from './AuthContext';

export type AuthContextProviderProps = WithChildren<{
  session: User | null;
  mode: KarmaMode;
  shouldAttemptReauthentication?: boolean;
  redirectDestinationIfUnauthenticated?: string;
}>;

export const endpoints = {
  login: {
    method: 'POST',
    url: '/api/v1/auth/login',
  },
  logout: {
    method: 'DELETE',
    url: '/api/v1/auth/logout',
  },
  me: {
    method: 'GET',
    url: '/api/v1/auth/me',
  },
  provider: {
    url: '/api/v1/auth/provider',
  },
  register: {
    method: 'POST',
    url: '/api/v1/auth/register',
  },
};

export function AuthContextProvider({
  children,
  mode,
  shouldAttemptReauthentication = false,
  session,
  redirectDestinationIfUnauthenticated,
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(session);

  useSSGReauthentication({
    mode,
    redirectDestinationIfUnauthenticated,
    setUser,
    shouldAttemptReauthentication,
  });

  /**
   * Given { provider: ENABLED_PROVIDER[number] }, will redirect.
   *
   * Given login data, will attempt to login.
   *
   * @returns
   * - nothing when redirecting
   * - the user when successfully authenticated
   * - the response status code when failing to authenticate
   * - INTERNAL_SERVER_ERROR when crashing
   */
  const login = useCallback(async (options: LoginOptions): Promise<
    User | number | null
  > => {
    if ('provider' in options) {
      if (ENABLED_PROVIDER.includes(options.provider)) {
        window.location.assign(
          endpoints.provider.url.replace('provider', options.provider)
        );
      }

      return null;
    }

    try {
      const { url, method } = endpoints.login;

      const response = await fetch(url, {
        body: JSON.stringify(options),
        method,
      });

      if (response.ok) {
        const json = await response.json();

        setUser(json);

        return json;
      }

      return response.status;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      return INTERNAL_SERVER_ERROR;
    }
  }, []);

  /**
   * Dispatches a request to the logout endpoint which deletes the session cookie.
   * Resets User object afterwards.
   */
  const logout = useCallback(async () => {
    const { url, method } = endpoints.logout;

    await fetch(url, { method });

    setUser(null);
  }, []);

  /**
   * Will attempt to register the user.
   *
   * @returns
   * - the user when successfully registered
   * - the response status code when failing to register
   * - INTERNAL_SERVER_ERROR when crashing
   */
  const register = useCallback(async (options: LocalLoginOptions): Promise<
    User | number
  > => {
    try {
      const { url, method } = endpoints.register;

      const response = await fetch(url, {
        body: JSON.stringify(options),
        method,
      });

      if (response.ok) {
        const json = await response.json();
        setUser(json);

        return json;
      }

      return response.status;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      return INTERNAL_SERVER_ERROR;
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      login,
      logout,
      register,
      user,
    }),
    [login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

type UseSSGReauthenticationArgs = Pick<
  AuthContextProviderProps,
  | 'mode'
  | 'redirectDestinationIfUnauthenticated'
  | 'shouldAttemptReauthentication'
> & {
  setUser: Dispatch<SetStateAction<User | null>>;
};

function useSSGReauthentication({
  mode,
  shouldAttemptReauthentication,
  redirectDestinationIfUnauthenticated,
  setUser,
}: UseSSGReauthenticationArgs) {
  const { push } = useRouter();

  useEffect(() => {
    if (mode !== 'ssg' || !shouldAttemptReauthentication) {
      return;
    }

    async function redirectOnFailure() {
      if (!redirectDestinationIfUnauthenticated) {
        return;
      }

      try {
        await push(redirectDestinationIfUnauthenticated);
      } catch {
        window.location.assign(redirectDestinationIfUnauthenticated);
      }
    }

    async function reauthenticate() {
      try {
        const { url, method } = endpoints.me;

        const response = await fetch(url, { method });

        if (response.ok) {
          const json = await response.json();

          setUser(json);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          redirectOnFailure();
        }
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        redirectOnFailure();
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reauthenticate();
  }, [
    mode,
    shouldAttemptReauthentication,
    redirectDestinationIfUnauthenticated,
    push,
    setUser,
  ]);
}
