import { createContext } from 'react';

interface ServiceWorkerContextDefinition {
  isSupported: boolean;
  registration: ServiceWorkerRegistration | null;
  options?: RegistrationOptions;
}

export const ServiceWorkerContext = createContext<ServiceWorkerContextDefinition | null>(
  null
);
