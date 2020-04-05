import { useContext } from 'react';

import { ServiceWorkerContext } from './context';

export default function useServiceWorker() {
  return useContext(ServiceWorkerContext)!;
}
