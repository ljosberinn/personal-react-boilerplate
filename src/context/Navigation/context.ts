import {
  createContext,
  PropsWithChildren,
  CElement,
  MouseEventHandler,
} from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { RouteDefinition } from '../../routes';

export interface PreloadingLinkProps {
  to: RouteDefinition;
  nav?: boolean;
  params?: { [key: string]: string | number };
  onMouseOver?: MouseEventHandler;
}

export type FlattenedRoutes = { [key: string]: RouteDefinition };

interface NavigationContextDefinition {
  routes: FlattenedRoutes;
  PreloadingLink: (
    props: PropsWithChildren<PreloadingLinkProps>
  ) => CElement<LinkProps<unknown>, Link<unknown>>;
}

export const NavigationContext = createContext<
  NavigationContextDefinition | undefined
>(undefined);
