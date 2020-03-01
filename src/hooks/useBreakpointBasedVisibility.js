import { useState, useEffect, useCallback } from 'react';

import useMediaQuery from './useMediaQuery';
import usePrevious from './usePrevious';

export default function useBreakpointVisibility(breakpoint) {
  const matchesBreakpoint = useMediaQuery(breakpoint);
  const previouslyMatched = usePrevious(matchesBreakpoint);

  const [isVisible, setIsVisible] = useState(matchesBreakpoint);

  useEffect(() => {
    // hide if breakpoint no longer matches
    if (!matchesBreakpoint && previouslyMatched && isVisible) {
      setIsVisible(false);
    }

    // show if breakpoint now matches
    if (matchesBreakpoint && !previouslyMatched && !isVisible) {
      setIsVisible(true);
    }
  }, [isVisible, matchesBreakpoint, previouslyMatched]);

  const toggle = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  return [isVisible, toggle];
}
