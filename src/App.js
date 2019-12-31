import React, { Suspense } from 'react';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import './assets/scss/app.scss';
import { Loader } from './components';
import { SHARED_ROUTES, LANGUAGE_ROUTE } from './routes/shared';
import { PUBLIC_ROUTES } from './routes/public';
import { PRIVATE_ROUTES } from './routes/private';
import RedirectToHome from './routes/RedirectToHome';
import Layout from './Layout';
import { useIdentityContext } from 'react-netlify-identity';
import languages from './constants/languages';
import { SentryErrorBoundary } from './components';

/**
 * @see https://github.com/sw-yx/react-netlify-identity/blob/master/src/runRoutes.tsx#L9
 */
const passwordRecoveryRegEx = /recovery_token=([^&]+)/;

/**
 * @returns {React.FC} App
 */
export default function App() {
  const { hash } = useLocation();
  const { replace } = useHistory();

  const { isLoggedIn } = useIdentityContext();

  const routes = Object.assign(
    SHARED_ROUTES,
    isLoggedIn ? PRIVATE_ROUTES : PUBLIC_ROUTES,
  );

  const passwordRecoveryMatches = hash.match(passwordRecoveryRegEx);

  if (passwordRecoveryMatches) {
    const token = passwordRecoveryMatches[1];

    replace(`/reset-password/${token}`);
    return null;
  }

  return (
    <Layout>
      <Switch>
        <Suspense fallback={<Loader isFullPage />}>
          <SentryErrorBoundary>
            {languages.map(lng => (
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
          </SentryErrorBoundary>
        </Suspense>
        <Route component={RedirectToHome} />
      </Switch>
    </Layout>
  );
}
