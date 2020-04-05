import { useContext } from 'react';

import { Auth0Context } from './context';

export default function useAuth0() {
  return useContext(Auth0Context)!;
}
