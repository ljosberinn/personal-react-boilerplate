import React, { useState, useEffect } from 'react';

import { supportsServiceWorker } from '../constants/browserAPIs';
import { useServiceWorker } from '../context';
import toast from '../utils/toast';

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
      if (registration.installing) {
        registration.installing.addEventListener('statechange', event => {
          if (event.target.state === 'installed') {
            setIsInstalled(true);
          }
        });
      }

      if (registration.waiting) {
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

  useEffect(() => {
    if (!supportsServiceWorker) {
      return;
    }

    if (isInstalled) {
      toast({
        type: 'info',
        autoClose: false,
        closeOnClick: true,
        content:
          'ServiceWorker successfully installed. Site is now partially available offline.',
      });
    }

    if (isWaiting) {
      function skipWaiting() {
        return registration.waiting
          ? registration.waiting.postMessage({
              type: 'SKIP_WAITING',
              payload: undefined,
            })
          : () => {};
      }

      toast({
        type: 'info',
        autoClose: false,
        closeOnClick: false,
        content: (
          <div onClick={skipWaiting}>
            Site has updated.To see changes close other tabs or click here.
          </div>
        ),
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWaiting, isInstalled, registration?.waiting]);

  return null;
}
