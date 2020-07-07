import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext/AuthContext';

export function useAuth() {
  return useContext(AuthContext)!;
}
