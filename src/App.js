import React, { useMemo } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';

import Layout from './Layout';
import { SentryErrorBoundary, ServiceWorker } from './components';
import { ENABLED_LANGUAGES } from './constants/env';
import { withSuspense } from './hocs';
import { useScrollToTop } from './hooks';
import LoadableComponent from './routes/loadUtils';
import { PRIVATE_ROUTES } from './routes/private';
import { PUBLIC_ROUTES } from './routes/public';
import { SHARED_ROUTES, LANGUAGE_ROUTE } from './routes/shared';

const RedirectToHome = LoadableComponent(() =>
  import('./routes/RedirectToHome'),
);

export default function App() {
  const { pathname } = useLocation();
  const { replace } = useHistory();
  const {
    isLoggedIn,
    param: { token, type },
  } = useIdentityContext();

  useScrollToTop();

  const routes = useMemo(
    () => ({
      ...SHARED_ROUTES,
      ...(isLoggedIn ? PRIVATE_ROUTES : PUBLIC_ROUTES),
    }),
    [isLoggedIn],
  );

  if (token && pathname === '/' && type === 'recovery') {
    replace('/reset-password', { token });
    return null;
  }

  return (
    <Layout>
      <SentryErrorBoundary>
        <ServiceWorker />
        <Switch>
          {ENABLED_LANGUAGES.map(lng => (
            <Route
              path={`/${lng}`}
              key={lng}
              exact
              component={withSuspense(LANGUAGE_ROUTE)}
            />
          ))}
          {Object.entries(routes).map(([path, component]) => (
            <Route
              path={path}
              key={path}
              component={withSuspense(component)}
              exact
            />
          ))}
          <Route component={RedirectToHome} />
        </Switch>
      </SentryErrorBoundary>
    </Layout>
  );
}
