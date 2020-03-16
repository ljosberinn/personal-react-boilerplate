import React, { useState, useEffect, lazy, memo } from 'react';

import { hasLocalStorage } from '../../constants/browserAPIs';
import withSuspense from '../../hocs/withSuspense';
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

export default memo(
  withSuspense(function DrawerNav(props) {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const wasPreviouslyDesktop = usePrevious(isDesktop);

    const [isExpanded, setIsExpanded] = useState(
      getExpansionFromLocalStorage(isDesktop),
    );

    useEffect(() => {
      // ignore auto-expanding the mobile nav when coming from desktop
      if (!isDesktop && wasPreviouslyDesktop && isExpanded) {
        setIsExpanded(false);
      }

      // auto expand desktop nav when increasing width
      if (isDesktop && !wasPreviouslyDesktop && !isExpanded) {
        setIsExpanded(true);
      }
    }, [isDesktop, isExpanded, wasPreviouslyDesktop]);

    function toggleMenu() {
      setIsExpanded(!isExpanded);
      persistExpansionToLocalStorage(!isExpanded);
    }

    if (isDesktop) {
      return (
        <Desktop toggleMenu={toggleMenu} isExpanded={isExpanded} {...props} />
      );
    }

    return (
      <Mobile toggleMenu={toggleMenu} isExpanded={isExpanded} {...props} />
    );
  }),
);
