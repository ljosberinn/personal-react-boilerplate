import { createContext } from 'react';

import type { I18nextResources } from '../../karma/i18n';

export type I18NContextDefinition = {
  language: string;
  resources: I18nextResources;
};

export const I18NContext = createContext<I18NContextDefinition | null>(null);
