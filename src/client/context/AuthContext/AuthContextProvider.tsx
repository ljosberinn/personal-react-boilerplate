import React, { PropsWithChildren, useState } from 'react';

import { AuthContext, User, LoginOptions } from './AuthContext';

type AuthContextProviderProps = PropsWithChildren<{ session: User | null }>;

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

    await fetch('/api/auth/local', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async function logout() {
    await fetch('/api/auth/logout');
    setUser(null);
  }

  const value = {
    login,
    logout,
    user,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
