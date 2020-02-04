import { useState, useEffect } from 'react';

import { supportsServiceWorker } from '../constants/browserAPIs';
import { useServiceWorker } from '../hooks';

/**
 *
 * @see https://github.com/deity-io/falcon/blob/master/packages/falcon-service-worker/src/ServiceWorker.tsx
 * @param {{
 * children: React.Children;
 * }}
 */
export default function ServiceWorker({ children }) {
  const [isWaiting, setIsWaiting] = useState(false);
  const { isSupported, registration } = useServiceWorker();

  function skipWaiting() {
    debugger;
    return registration.waiting
      ? registration.waiting.postMessage({
          type: 'SKIP_WAITING',
          payload: undefined,
        })
      : () => {};
  }

  useEffect(() => {
    if (!supportsServiceWorker || !registration) {
      return;
    }

    if (registration.active && registration.waiting) {
      setIsWaiting(true);
      return;
    }

    function onUpdateFound() {
      if (registration.installing) {
        registration.installing.addEventListener('statechange', event => {
          if (event.target.state === 'installed') {
            setIsWaiting(true);
          }
        });
      }
    }

    if (registration.installing) {
      return onUpdateFound();
    }

    registration.addEventListener('updatefound', onUpdateFound);

    return () => {
      registration.removeEventListener('updatefound', onUpdateFound);
    };
  }, [registration]);

  if (isSupported && registration) {
    return children({
      isWaiting,
      skipWaiting,
      isSupported,
      registration,
    });
  }

  return children({ isSupported, isWaiting: false, skipWaiting: () => {} });
}
