import type { NextRouter } from 'next/router';
import Router from 'next/router';
import { useEffect } from 'react';

import { IS_BROWSER } from '../../constants';

const isSupported = IS_BROWSER
  ? (() => {
      if (!('scrollRestoration' in window.history)) {
        return false;
      }

      if (!('sessionStorage' in window)) {
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
    })()
  : false;

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
    if (!isSupported) {
      return;
    }

    let shouldScrollRestore = false;

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
      if (shouldScrollRestore) {
        shouldScrollRestore = false;
        restoreScrollPos(url);
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    Router.events.on('routeChangeStart', onRouteChangeStart);
    Router.events.on('routeChangeComplete', onRouteChangeComplete);
    Router.beforePopState(() => {
      shouldScrollRestore = true;
      return true;
    });

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      Router.events.off('routeChangeStart', onRouteChangeStart);
      Router.events.off('routeChangeComplete', onRouteChangeComplete);
      Router.beforePopState(() => true);
    };
  }, [router]);
}
