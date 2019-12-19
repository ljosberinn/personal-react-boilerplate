import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './assets/scss/app.scss';
import { Loader } from './components';
import { SHARED_ROUTES, LANGUAGE_ROUTE } from './routes/shared';
import { PUBLIC_ROUTES } from './routes/public';
import { PRIVATE_ROUTES } from './routes/private';
import RedirectToHome from './routes/RedirectToHome';
import Layout from './Layout';
import { useIdentityContext } from 'react-netlify-identity';
import { availableLanguages } from './components/LanguageSwitch';

/**
 * @returns {React.FC} App
 */
export default function App() {
  const { isLoggedIn } = useIdentityContext();

  const routes = Object.assign(
    SHARED_ROUTES,
    isLoggedIn ? PRIVATE_ROUTES : PUBLIC_ROUTES,
  );

  return (
    <Router>
      <Layout>
        <Switch>
          <Suspense fallback={<Loader isFullPage />}>
            {availableLanguages.map(lng => (
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
          </Suspense>
          <Route component={RedirectToHome} />
        </Switch>
      </Layout>
    </Router>
  );
}
