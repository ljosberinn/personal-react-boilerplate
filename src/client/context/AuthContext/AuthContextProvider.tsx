import React, { PropsWithChildren, useState } from 'react';

import { AuthContext, User } from './AuthContext';

type AuthContextProviderProps = PropsWithChildren<{}>;

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  async function login() {
    setUser({ name: 'galex' });
  }

  async function logout() {
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
