import React, {
  createContext,
  createElement,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { Link } from 'react-router-dom';

import * as PRIVATE_ROUTES from '../routes/private';
import * as PUBLIC_ROUTES from '../routes/public';
import * as SHARED_ROUTES from '../routes/shared';

const NavigationContext = createContext();

export function useNavigationContext() {
  return useContext(NavigationContext);
}

const computeRoutes = isLoggedIn => ({
  ...SHARED_ROUTES,
  ...(isLoggedIn ? PRIVATE_ROUTES : PUBLIC_ROUTES),
});

const preloadedMap = new Map();

export default function NavigationProvider({ children }) {
  const { isLoggedIn } = useIdentityContext();
  const routes = useMemo(() => computeRoutes(isLoggedIn), [isLoggedIn]);

  const PreloadingLink = useCallback(
    ({
      onMouseOver: parentOnMouseOver,
      to: { clientPath },
      as = Link,
      ...rest
    }) => {
      function onMouseOver(event) {
        if (parentOnMouseOver) {
          parentOnMouseOver(event);
        }

        if (preloadedMap.has(clientPath)) {
          return;
        }

        const match = Object.values(routes).find(
          route => route.clientPath === clientPath,
        );

        if (match) {
          try {
            match.component.preload();
            preloadedMap.set(clientPath, true);
          } catch (error) {
            console.error(error);
            // clean up in case of error as .preload is async
            if (preloadedMap.has(clientPath)) {
              preloadedMap.delete(clientPath);
            }
          }
        }
      }

      return createElement(as, {
        ...rest,
        onMouseOver,
        to: clientPath,
      });
    },
    [routes],
  );

  return (
    <NavigationContext.Provider value={{ routes, PreloadingLink }}>
      {children}
    </NavigationContext.Provider>
  );
}
