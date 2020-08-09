import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth was called outside of an AuthContextProvider.');
  }

  return ctx;
}
