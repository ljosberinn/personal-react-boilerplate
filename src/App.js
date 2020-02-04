import { useIdentityContext } from 'react-netlify-identity';

import { Button } from 'rbx';
import React from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';

import './assets/scss/app.scss';
import Layout from './Layout';
import { SentryErrorBoundary, ServiceWorker } from './components';
import { ENABLED_LANGUAGES } from './constants/env';
import { useScrollToTop } from './hooks';
import LoadableComponent from './routes/loadUtils';
import { PRIVATE_ROUTES } from './routes/private';
import { PUBLIC_ROUTES } from './routes/public';
import { SHARED_ROUTES, LANGUAGE_ROUTE } from './routes/shared';
import toast from './utils/toast';

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

  const routes = {
    ...SHARED_ROUTES,
    ...(isLoggedIn ? PRIVATE_ROUTES : PUBLIC_ROUTES),
  };
  
  return (
    <Layout>
      <SentryErrorBoundary>
        <ServiceWorker>
          {({ isWaiting, skipWaiting }) => {
            if (isWaiting) {
              toast({
                type: 'info',
                autoClose: false,
                closeOnClick: false,
                content: (
                  <>
                    Site has updated.To see changes close other tabs or
                    <Button
                      size="small"
                      type="button"
                      color="primary"
                      onClick={skipWaiting}
                    >
                      click here
                    </Button>
                  </>
                ),
              });
            }

            return null;
          }}
        </ServiceWorker>
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
