import { useEffect, useRef } from 'react';

export function useIsMounted(): { current: boolean } {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}
