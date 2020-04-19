import React, { useState, useEffect, PropsWithChildren } from 'react';

import { supportsServiceWorker } from '../../constants/browser';
import { ServiceWorkerContext } from './context';

function onControllerChange(event: Event) {
  if (event.currentTarget !== navigator.serviceWorker) {
    window.location.reload();
  }
}

function whenReady(callback: () => void) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}

const { origin } = new URL(window.location.href);
const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

type Props = PropsWithChildren<{ options?: RegistrationOptions }>;

/**
 *
 * @see https://github.com/deity-io/falcon/blob/master/packages/falcon-service-worker/src/ServiceWorkerRegistrar.tsx
 */
export default function ServiceWorkerProvider({ children, options }: Props) {
  const [
    registration,
    setRegistration,
  ] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!supportsServiceWorker) {
      return;
    }

    whenReady(() => {
      if (origin !== window.location.origin) {
        return;
      }

      navigator.serviceWorker
        .register(swUrl, options)
        .then(registration => {
          setRegistration(registration);

          navigator.serviceWorker.addEventListener(
            'controllerchange',
            onControllerChange
          );

          console.log(
            `Service Worker registered in '${registration.scope}' scope.`
          );
        })
        .catch(error => {
          console.warn(`Service Worker registration failed.`, error);
        });
    });

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange
      );
    };
  }, [options]);

  return (
    <ServiceWorkerContext.Provider
      value={{
        isSupported: supportsServiceWorker,
        registration,
        options,
      }}
    >
      {children}
    </ServiceWorkerContext.Provider>
  );
}
