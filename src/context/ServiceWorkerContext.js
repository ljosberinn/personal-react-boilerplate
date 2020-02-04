import React, { createContext, useState, useEffect } from 'react';

import { supportsServiceWorker } from '../constants/browserAPIs';

export const ServiceWorkerContext = createContext({
  isSupported: false,
});

function onControllerChange(event) {
  if (event.currentTarget !== navigator.serviceWorker.controller) {
    return window.location.reload();
  }
}

function whenReady(callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback);
  }
}

/**
 *
 * @param {{
 * chilren: React.ReactChildren;
 * options?: RegistrationOptions;
 * }}
 *
 * @see https://github.com/deity-io/falcon/blob/master/packages/falcon-service-worker/src/ServiceWorkerRegistrar.tsx
 */
export default function ServiceWorkerProvider({ children, options }) {
  const [isSupported, setIsSupported] = useState(supportsServiceWorker);
  const [registration, setRegistration] = useState(undefined);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    whenReady(() => {
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

      if (publicUrl.origin !== window.location.origin) {
        return;
      }

      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl, options)
        .then(registration => {
          setIsSupported(true);
          setRegistration(registration);

          navigator.serviceWorker.addEventListener(
            'controllerchange',
            onControllerChange,
          );

          console.log(
            `Service Worker registered in '${registration.scope}' scope.`,
          );
        })
        .catch(error => {
          console.warn(`Service Worker registration failed.`, error);
        });
    });

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      );
    };
  }, [isSupported, options]);

  return (
    <ServiceWorkerContext.Provider
      value={{ isSupported, registration, options }}
    >
      {children}
    </ServiceWorkerContext.Provider>
  );
}
