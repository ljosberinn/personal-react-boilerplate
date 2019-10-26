import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './assets/scss/app.scss';
import { Loader } from './components';
import { SHARED_ROUTES } from './routes/shared';
import { PUBLIC_ROUTES } from './routes/public';
import { PRIVATE_ROUTES } from './routes/private';
import Layout from './Layout';
import { useAuth } from './hooks';

function App() {
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
            </Suspense>
          </Switch>
        )}
      </Layout>
    </Router>
  );
}

export default App;
