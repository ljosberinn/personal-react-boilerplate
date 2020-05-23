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

    // const { mail, password } = options;
    // todo: local login
  }

  async function logout() {
    await fetch('/api/auth/logout');
    setUser(null);
  }

  const value = {
    login,
    logout,
    isAuthenticated: !!user,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
