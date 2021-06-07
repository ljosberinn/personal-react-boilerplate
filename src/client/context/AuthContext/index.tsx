import Router from 'next/router';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createContext,
} from 'react';
import type { SetStateAction, Dispatch } from 'react';

import { ENABLED_PROVIDER } from '../../../constants';
import { INTERNAL_SERVER_ERROR } from '../../../utils/statusCodes';
import { useIsMounted } from '../../hooks/useIsMounted';
import type { WithChildren, KarmaMode } from '../../karma/types';
import type {
  User,
  LoginOptions,
  LocalLoginOptions,
  AuthContextDefinition,
} from './types';

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

export const AuthContext = createContext<AuthContextDefinition | null>(null);

export function AuthContextProvider({
  children,
  mode,
  shouldAttemptReauthentication = false,
  session,
  redirectDestinationIfUnauthenticated,
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(session);

  const isReauthenticating = useSSGReauthentication({
    mode,
    redirectDestinationIfUnauthenticated,
    setUser,
    shouldAttemptReauthentication,
    user,
  });

  const login = useCallback(
    async (options: LoginOptions): Promise<User | number | null> => {
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
          const json: User = await response.json();

          setUser(json);

          return json;
        }

        return response.status;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        return INTERNAL_SERVER_ERROR;
      }
    },
    []
  );

  const logout = useCallback(async (redirectDestination?: string) => {
    const { url, method } = endpoints.logout;

    await fetch(url, { method });

    setUser(null);

    if (redirectDestination) {
      try {
        await Router.push(redirectDestination);
      } catch {
        window.location.assign(redirectDestination);
      }
    }
  }, []);

  /**
   * Will attempt to register the user.
   *
   * @returns
   * - the user when successfully registered
   * - the response status code when failing to register
   * - INTERNAL_SERVER_ERROR when crashing
   */
  const register = useCallback(
    async (options: LocalLoginOptions): Promise<User | number> => {
      try {
        const { url, method } = endpoints.register;

        const response = await fetch(url, {
          body: JSON.stringify(options),
          method,
        });

        if (response.ok) {
          const json: User = await response.json();
          setUser(json);

          return json;
        }

        return response.status;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);

        return INTERNAL_SERVER_ERROR;
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      login,
      logout,
      register,
      user,
      isReauthenticating,
    }),
    [login, logout, register, user, isReauthenticating]
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
  user: User | null;
};

function useSSGReauthentication({
  mode,
  shouldAttemptReauthentication,
  redirectDestinationIfUnauthenticated,
  setUser,
  user,
}: UseSSGReauthenticationArgs) {
  /**
   * do not attempt to reauthenticate if:
   * - mode is not ssg, should authenticate through SSR then
   * - explicitly opted out of reauthentication
   * - user already present
   */
  const [isReauthenticating, setIsReauthenticating] = useState(
    mode === 'ssg' && !!shouldAttemptReauthentication && !user
  );
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isReauthenticating) {
      return;
    }

    async function redirectOnFailure() {
      if (!redirectDestinationIfUnauthenticated) {
        return;
      }

      try {
        await Router.push(redirectDestinationIfUnauthenticated);
      } catch {
        window.location.assign(redirectDestinationIfUnauthenticated);
      }
    }

    async function reauthenticate() {
      try {
        const { url, method } = endpoints.me;

        const response = await fetch(url, {
          method,
        });

        if (response.ok) {
          const json: User = await response.json();

          setUser(json);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          redirectOnFailure();
        }
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        redirectOnFailure();
      } finally {
        if (isMounted.current) {
          setIsReauthenticating(false);
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reauthenticate();
  }, [
    isMounted,
    isReauthenticating,
    redirectDestinationIfUnauthenticated,
    setUser,
  ]);

  return isReauthenticating;
}
