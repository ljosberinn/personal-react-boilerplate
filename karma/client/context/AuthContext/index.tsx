import { useState } from 'react';

import { ENABLED_PROVIDER } from '../../../../src/constants';
import { INTERNAL_SERVER_ERROR } from '../../../utils/statusCodes';
import type { WithChildren } from '../../Karma';
import type { User, LoginOptions, LocalLoginOptions } from './AuthContext';
import { AuthContext } from './AuthContext';

export interface AuthContextProviderProps extends WithChildren {
  session: User | null;
}

export const endpoints = {
  login: {
    method: 'POST',
    url: '/api/v1/auth/login',
  },
  logout: {
    method: 'DELETE',
    url: '/api/v1/auth/logout',
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
  session,
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(session);

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
  async function login(options: LoginOptions): Promise<User | number | null> {
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
  }

  /**
   * Dispatches a request to the logout endpoint which deletes the session cookie.
   * Resets User object afterwards.
   */
  async function logout() {
    const { url, method } = endpoints.logout;

    await fetch(url, { method });
    setUser(null);
  }

  /**
   * Will attempt to register the user.
   *
   * @returns
   * - the user when successfully registered
   * - the response status code when failing to register
   * - INTERNAL_SERVER_ERROR when crashing
   */
  async function register(options: LocalLoginOptions): Promise<User | number> {
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
  }

  const value = {
    isAuthenticated: !!user,
    login,
    logout,
    register,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
