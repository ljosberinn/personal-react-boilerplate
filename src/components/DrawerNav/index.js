import React, { useState, useEffect, lazy, memo } from 'react';

import { hasLocalStorage } from '../../constants/browserAPIs';
import { useMediaQuery, usePrevious } from '../../hooks';

const Mobile = lazy(() =>
  import(/* webpackChunkName: "drawer_nav.mobile" */ './Mobile'),
);

const Desktop = lazy(() =>
  import(/* webpackChunkName: "drawer_nav.desktop" */ './Desktop'),
);

const localStorageMeta = {
  key: 'drawerNavState',
  open: 'open',
  closed: 'closed',
};
/**
 *
 * @param {boolean} isDesktop
 */
const getExpansionFromLocalStorage = isDesktop => {
  if (hasLocalStorage) {
    const storedState = localStorage.getItem(localStorageMeta.key);

    return storedState ? storedState === localStorageMeta.open : isDesktop;
  }

  return isDesktop;
};

/**
 *
 * @param {boolean} isExpanded
 */
const persistExpansionToLocalStorage = isExpanded => {
  if (hasLocalStorage) {
    localStorage.setItem(
      localStorageMeta.key,
      isExpanded ? localStorageMeta.open : localStorageMeta.closed,
    );
  }
};

export default memo(function DrawerNav() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const wasPreviouslyDesktop = usePrevious(isDesktop);
  const [isExpanded, setIsExpanded] = useState(
    getExpansionFromLocalStorage(isDesktop),
  );

  function toggleMenu() {
    setIsExpanded(!isExpanded);
    persistExpansionToLocalStorage(!isExpanded);
  }

  useEffect(() => {
    if (!isDesktop && wasPreviouslyDesktop && isExpanded) {
      setIsExpanded(false);
    }

    if (isDesktop && !wasPreviouslyDesktop && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isDesktop, isExpanded, wasPreviouslyDesktop]);

  if (isDesktop) {
    return <Desktop toggleMenu={toggleMenu} isExpanded={isExpanded} />;
  }

  return <Mobile toggleMenu={toggleMenu} isExpanded={isExpanded} />;
});
