import type { NextRouter } from 'next/router';
import { useEffect } from 'react';

import { IS_BROWSER } from '../../constants';

const isSupported = () => {
  if (IS_BROWSER) {
    if (
      !('scrollRestoration' in window.history) ||
      !('sessionStorage' in window)
    ) {
      return false;
    }

    try {
      const sessionStorageTestKey = '_ss_test_key_';

      sessionStorage.setItem(sessionStorageTestKey, sessionStorageTestKey);
      sessionStorage.removeItem(sessionStorageTestKey);

      return true;
    } catch {
      return false;
    }
  }

  return false;
};

const saveScrollPos = (url: string) => {
  const scrollPos = { x: window.scrollX, y: window.scrollY };

  sessionStorage.setItem(url, JSON.stringify(scrollPos));
};

const restoreScrollPos = (url: string) => {
  const entry = sessionStorage.getItem(url);

  if (entry) {
    const { x, y } = JSON.parse(entry);

    window.scrollTo(x, y);
  }
};

// eslint-disable-next-line inclusive-language/use-inclusive-words
/**
 * Saves the scroll position securely within `sessionStorage`
 *
 * Can be
 *
 * @see https://github.com/alanqchen/Bear-Blog-Engine/blob/master/frontend/components/utils/useScrollRestoration.js
 */
export function useScrollRestoration(router: NextRouter): void {
  useEffect(() => {
    if (!isSupported()) {
      return;
    }

    let shouldRestorePosition = false;

    window.history.scrollRestoration = 'manual';
    restoreScrollPos(router.asPath);

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      saveScrollPos(router.asPath);
      delete event.returnValue;
    };

    const onRouteChangeStart = () => {
      saveScrollPos(router.asPath);
    };

    const onRouteChangeComplete = (url: string) => {
      if (shouldRestorePosition) {
        shouldRestorePosition = false;
        restoreScrollPos(url);
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    router.events.on('routeChangeStart', onRouteChangeStart);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    router.beforePopState(() => {
      shouldRestorePosition = true;
      return true;
    });

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      router.events.off('routeChangeStart', onRouteChangeStart);
      router.events.off('routeChangeComplete', onRouteChangeComplete);
      router.beforePopState(() => true);
    };
  }, [router]);
}
