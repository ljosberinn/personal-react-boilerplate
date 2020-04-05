import { useContext } from 'react';

import { Auth0Context } from './Auth0Context';

export default function useAuth0() {
  return useContext(Auth0Context)!;
}
