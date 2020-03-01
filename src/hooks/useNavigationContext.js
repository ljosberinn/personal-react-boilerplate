import { useContext } from 'react';

import { NavigationContext } from '../context/NavigationContext';

export default function useNavigationContext() {
  return useContext(NavigationContext);
}
