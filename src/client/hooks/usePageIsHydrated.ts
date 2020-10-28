import { useEffect, useState } from 'react';

export function usePageIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  // eslint-disable-next-line prefer-arrow-callback
  useEffect(function setHydrated() {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}
