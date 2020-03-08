import React, { createContext, useState, useEffect, useContext } from 'react';

import { supportsServiceWorker } from '../constants/browserAPIs';

const ServiceWorkerContext = createContext();

/**
 * @returns {{
 * isSupported: boolean;
 * registration?: ServiceWorkerRegistration;
 * options?: RegistrationOptions;
 * }}
 */
export function useServiceWorker() {
  return useContext(ServiceWorkerContext);
}

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

const { origin } = new URL(process.env.PUBLIC_URL, window.location.href);
const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

/**
 *
 * @param {{
 * chilren: JSX.Element;
 * options?: RegistrationOptions;
 * }}
 *
 * @see https://github.com/deity-io/falcon/blob/master/packages/falcon-service-worker/src/ServiceWorkerRegistrar.tsx
 */
export default function ServiceWorkerProvider({ children, options }) {
  const [registration, setRegistration] = useState(undefined);

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
