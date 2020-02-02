import React from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { useIdentityContext } from 'react-netlify-identity';
import { SHARED_ROUTES, LANGUAGE_ROUTE } from './routes/shared';
import './assets/scss/app.scss';
import { PUBLIC_ROUTES } from './routes/public';
import { PRIVATE_ROUTES } from './routes/private';
import Layout from './Layout';
import { ENABLED_LANGUAGES } from './constants/env';
import { SentryErrorBoundary } from './components';
import LoadableComponent from './routes/loadUtils';
import { useScrollToTop } from './hooks';

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

  if (token && pathname === '/' && type === 'recovery') {
    replace('/reset-password', { token });
    return null;
  }

  const routes = Object.assign(
    SHARED_ROUTES,
    isLoggedIn ? PRIVATE_ROUTES : PUBLIC_ROUTES,
  );

  return (
    <Layout>
      <SentryErrorBoundary>
        <Switch>
          {ENABLED_LANGUAGES.map(lng => (
            <Route
              path={`/${lng}`}
              key={lng}
              exact
              component={LANGUAGE_ROUTE}
            />
          ))}
          {Object.entries(routes).map(([path, component]) => (
            <Route path={path} component={component} exact key={path} />
          ))}
          <Route component={RedirectToHome} />
        </Switch>
      </SentryErrorBoundary>
    </Layout>
  );
}
