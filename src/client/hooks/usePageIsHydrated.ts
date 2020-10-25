import { useEffect, useState } from 'react';

import { IS_BROWSER } from '../../constants';

export function usePageIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    /* istanbul ignore next */
    if (IS_BROWSER) {
      setIsHydrated(true);
    }
  }, []);

  return isHydrated;
}
