import { useContext } from 'react';

import { NavigationContext } from './NavigationContext';

export default function useNavigation() {
  return useContext(NavigationContext)!;
}
