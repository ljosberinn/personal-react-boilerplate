import React, { PropsWithChildren, useState } from 'react';

import {
  AuthContext,
  User,
  LoginOptions,
  LocalLoginOptions,
} from './AuthContext';

export type AuthContextProviderProps = PropsWithChildren<{
  session: User | null;
}>;

export default function AuthContextProvider({
  children,
  session,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(session);

  async function login(options: LoginOptions) {
    if ('provider' in options) {
      window.location.href = `/api/auth/${options.provider}`;
      return;
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(options),
    });

    const json = await response.json();

    setUser(json);
  }

  async function logout() {
    await fetch('/api/auth/logout');
    setUser(null);
  }

  async function signup(options: LocalLoginOptions) {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(options),
      });

      const json = await response.json();

      setUser(json);
    } catch (error) {
      console.error(error);
    }
  }

  const value = {
    user,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
