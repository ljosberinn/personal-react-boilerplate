import { useContext } from 'react';

import { ServiceWorkerContext } from './ServiceWorkerContext';

export default function useServiceWorker() {
  return useContext(ServiceWorkerContext)!;
}
