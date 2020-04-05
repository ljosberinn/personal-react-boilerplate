import React, {
  createElement,
  useCallback,
  useMemo,
  PropsWithChildren,
  MouseEvent,
} from 'react';
import { Link, NavLink } from 'react-router-dom';

import { useAuth0 } from '../../hooks/useAuth0';
import * as ROUTES from '../../routes';
import {
  NavigationContext,
  PreloadingLinkProps,
  FlattenedRoutes,
} from './context';

let cachedFlattenedRoutes: FlattenedRoutes = {};

export const computeCurrentRoutes = (
  isAuthenticated: boolean
): FlattenedRoutes => {
  const visibilityCriteria = ['static', isAuthenticated ? 'private' : 'public'];

  if (!cachedFlattenedRoutes.INDEX) {
    cachedFlattenedRoutes = Object.entries(ROUTES).reduce<FlattenedRoutes>(
      (carry, [name, route]) => {
        carry[name] = route;

        return carry;
      },
      {}
    );
  }

  return Object.fromEntries(
    Object.entries(cachedFlattenedRoutes).filter(([_, { visibility }]) =>
      visibilityCriteria.includes(visibility)
    )
  );
};

type Props = PropsWithChildren<{}>;

export default function NavigationProvider({ children }: Props) {
  const { isAuthenticated } = useAuth0();

  const routes = useMemo(() => computeCurrentRoutes(isAuthenticated), [
    isAuthenticated,
  ]);

  const PreloadingLink = useCallback(function PreloadingLink({
    onMouseOver: parentMouseOver,
    to: { path, component },
    params,
    nav,
    ...rest
  }: PreloadingLinkProps) {
    function onMouseOver(event: MouseEvent) {
      if (parentMouseOver) {
        parentMouseOver(event);
      }

      try {
        component.preload();
      } catch (error) {
        console.error(error);
      }
    }

    return createElement(nav ? NavLink : Link, {
      ...rest,
      onMouseOver,
      to: path.client(params),
    });
  },
  []);

  return (
    <NavigationContext.Provider value={{ PreloadingLink, routes }}>
      {children}
    </NavigationContext.Provider>
  );
}
