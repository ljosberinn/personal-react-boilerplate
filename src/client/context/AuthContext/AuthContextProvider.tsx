import React, { useState, ReactNode } from 'react';

import {
  AuthContext,
  User,
  LoginOptions,
  LocalLoginOptions,
} from './AuthContext';

export interface AuthContextProviderProps {
  session: User | null;
  children: ReactNode;
}

export default function AuthContextProvider({
  children,
  session,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(session);

  async function login(options: LoginOptions) {
    if ('provider' in options) {
      window.location.href = `/api/v1/auth/${options.provider}`;
      return;
    }

    const response = await fetch('/api/v1/auth/login', {
      body: JSON.stringify(options),
      method: 'POST',
    });

    const json = await response.json();

    setUser(json);
  }

  async function logout() {
    await fetch('/api/v1/auth/logout');
    setUser(null);
  }

  async function signup(options: LocalLoginOptions) {
    try {
      const response = await fetch('/api/v1/auth/signup', {
        body: JSON.stringify(options),
        method: 'POST',
      });

      const json = await response.json();

      setUser(json);
    } catch (error) {
      console.error(error);
    }
  }

  const value = {
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
