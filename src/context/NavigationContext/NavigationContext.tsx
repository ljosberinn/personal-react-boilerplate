import React, {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  PropsWithChildren,
  MouseEvent,
  MouseEventHandler,
  CElement,
} from 'react';
import { Link, NavLink, LinkProps } from 'react-router-dom';

import * as ROUTES from '../../routes';
import { RouteDefinition } from '../../routes';

const routes = Object.values(ROUTES).reduce<RouteDefinition[]>(
  (carry, { childRoutes, ...route }) => [...carry, route, ...childRoutes],
  []
);

interface PreloadingLinkProps {
  to: RouteDefinition;
  nav?: boolean;
  params?: { [key: string]: string | number };
  onMouseOver?: MouseEventHandler;
}

interface NavigationContextDefinition {
  routes: RouteDefinition[];
  PreloadingLink: (
    props: PropsWithChildren<PreloadingLinkProps>
  ) => CElement<LinkProps<unknown>, Link<unknown>>;
}

const NavigationContext = createContext<
  NavigationContextDefinition | undefined
>(undefined);

export function useNavigation() {
  return useContext(NavigationContext);
}

const computeCurrentRoutes = (isAuthenticated: boolean) => {
  const visibilityCriteria = ['static', isAuthenticated ? 'private' : 'public'];

  return routes.filter(({ visibility }) =>
    visibilityCriteria.includes(visibility)
  );
};

type Props = PropsWithChildren<{}>;

const preloadedMap = new Map<string, boolean>();

export default function NavigationProvider({ children }: Props) {
  const isAuthenticated = false;

  const routes = useMemo(() => computeCurrentRoutes(isAuthenticated), [
    isAuthenticated,
  ]);

  const PreloadingLink = useCallback(
    ({
      onMouseOver: parentMouseOver,
      to: { path, component },
      params,
      nav,
      ...rest
    }: PreloadingLinkProps) => {
      const { client, router } = path;

      function onMouseOver<MouseEventHandler>(event: MouseEvent) {
        if (parentMouseOver) {
          parentMouseOver(event);
        }

        const wasPreviouslyLoaded = preloadedMap.has(router);

        if (wasPreviouslyLoaded) {
          return;
        }

        try {
          component.preload();
          preloadedMap.set(router, true);
        } catch (error) {
          console.error(error);

          // clean up in case of error as .preload is obviously asnc
          if (preloadedMap.has(router)) {
            preloadedMap.delete(router);
          }
        }
      }

      return createElement(nav ? NavLink : Link, {
        ...rest,
        onMouseOver,
        to: client(params),
      });
    },
    []
  );

  return (
    <NavigationContext.Provider value={{ PreloadingLink, routes }}>
      {children}
    </NavigationContext.Provider>
  );
}
