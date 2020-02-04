import { useContext } from 'react';

import { ServiceWorkerContext } from '../context/ServiceWorkerContext';

/**
 * @returns {{
 * isSupported: boolean;
 * registration?: ServiceWorkerRegistration;
 * options?: RegistrationOptions;
 * }}
 */
export default function useServiceWorker() {
  return useContext(ServiceWorkerContext);
}
