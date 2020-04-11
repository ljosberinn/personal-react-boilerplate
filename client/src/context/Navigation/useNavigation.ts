import { useContext } from 'react';

import { NavigationContext } from './context';

export default function useNavigation() {
  return useContext(NavigationContext)!;
}
