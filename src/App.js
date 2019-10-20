import React, { Suspense, StrictMode } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import './assets/scss/app.scss';
import { Loader } from './components';
import { PUBLIC_ROUTES } from './routes/public';
import Layout from './Layout';

function App() {
  return (
    <StrictMode>
      <Router>
        <Switch>
          <Layout>
            <Route path={Object.keys(PUBLIC_ROUTES)} exact>
              <Suspense fallback={<Loader isFullPage />}>
                {Object.entries(PUBLIC_ROUTES).map(([path, component]) => (
                  <Route path={path} component={component} exact key={path} />
                ))}
              </Suspense>
            </Route>

            <Route>
              <Redirect to="/" />
            </Route>
          </Layout>
        </Switch>
      </Router>
    </StrictMode>
  );
}

export default App;
