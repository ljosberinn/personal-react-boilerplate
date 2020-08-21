import { useContext } from 'react';

import {
  AuthContext,
  AuthContextDefinition,
} from '../context/AuthContext/AuthContext';

export function useAuth(): AuthContextDefinition {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth was called outside of an AuthContextProvider.');
  }

  return ctx;
}
