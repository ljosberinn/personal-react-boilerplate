import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './assets/scss/app.scss';
import { Loader } from './components';
import { SHARED_ROUTES } from './routes/shared';
import { PUBLIC_ROUTES } from './routes/public';
import { PRIVATE_ROUTES } from './routes/private';
import RedirectToHome from './routes/RedirectToHome';
import Layout from './Layout';
import { useAuth } from './hooks';

export default function App() {
  const { isLoading, user } = useAuth();

  const routes = Object.assign(
    SHARED_ROUTES,
    user ? PRIVATE_ROUTES : PUBLIC_ROUTES,
  );

  return (
    <Router>
      <Layout>
        {isLoading ? (
          <Loader isFullPage />
        ) : (
          <Switch>
            <Suspense fallback={<Loader isFullPage />}>
              {Object.entries(routes).map(([path, component]) => (
                <Route path={path} component={component} exact key={path} />
              ))}
              <Route component={RedirectToHome} />
            </Suspense>
          </Switch>
        )}
      </Layout>
    </Router>
  );
}
