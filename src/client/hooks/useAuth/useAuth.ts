import { useContext } from 'react';

import { AuthContext } from '../../context/AuthContext/AuthContext';

export default function useAuth() {
  return useContext(AuthContext)!;
}
