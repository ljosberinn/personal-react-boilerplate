import {
  createContext,
  PropsWithChildren,
  MouseEventHandler,
  RefAttributes,
  FunctionComponentElement,
} from 'react';
import { NavLinkProps } from 'react-router-dom';

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
  ) => FunctionComponentElement<
    NavLinkProps<unknown> & RefAttributes<HTMLAnchorElement>
  >;
}

export const NavigationContext = createContext<
  NavigationContextDefinition | undefined
>(undefined);
