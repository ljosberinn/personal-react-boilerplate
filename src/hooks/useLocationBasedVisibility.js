import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import usePrevious from './usePrevious';

export default function useLocationBasedVisibility(initialState = false) {
  const { pathname } = useLocation();
  const previousPath = usePrevious(pathname);

  const [isVisible, setIsVisible] = useState(initialState);

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  useEffect(() => {
    if (isVisible && pathname !== previousPath) {
      setIsVisible(false);
    }
  }, [isVisible, pathname, previousPath]);

  return useMemo(() => [isVisible, toggle], [isVisible, toggle]);
}
