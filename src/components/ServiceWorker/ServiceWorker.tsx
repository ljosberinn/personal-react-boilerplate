import { useState, useEffect } from 'react';

import { supportsServiceWorker } from '../../constants/browser';
import { useServiceWorker } from '../../context';

/**
 *
 * @see https://github.com/deity-io/falcon/blob/master/packages/falcon-service-worker/src/ServiceWorker.tsx
 */
export default function ServiceWorker() {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { registration } = useServiceWorker();

  useEffect(() => {
    if (!supportsServiceWorker || !registration) {
      return;
    }

    if (registration.active && registration.waiting) {
      setIsWaiting(true);
      return;
    }

    function onUpdateFound() {
      if (registration!.installing) {
        registration!.installing.addEventListener('statechange', () => {
          if (registration!.installing!.state === 'installed') {
            setIsInstalled(true);
          }
        });
      }

      if (registration!.waiting) {
        setIsWaiting(true);
      }
    }

    if (registration.installing) {
      onUpdateFound();
      return;
    }

    registration.addEventListener('updatefound', onUpdateFound);

    return () => {
      registration.removeEventListener('updatefound', onUpdateFound);
    };
  }, [registration]);

  return null;
}
