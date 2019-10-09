import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect,
} from 'react-router-dom';
import { Title, Section } from 'rbx';
import './assets/scss/app.scss';

import { Loader } from './components';
import PublicRoutesContainer, { PUBLIC_ROUTES } from './routes/public';
//import PrivateRoutesContainer, { PRIVATE_ROUTES } from './routes/private';

function App() {
  return (
    <Router>
      <div className="transition-container">
        <Switch>
          <Route path={Object.keys(PUBLIC_ROUTES)} exact>
            <PublicRoutesContainer>
              <Suspense fallback={<Loader />}>
                {Object.entries(PUBLIC_ROUTES).map(([path, component]) => (
                  <Route path={path} component={component} key={path} />
                ))}
              </Suspense>
            </PublicRoutesContainer>
          </Route>
          {/*<Suspense fallback={<Loader isFullPage />}>*/}
          <Route path="/" exact>
            <Section>
              <Title>currently implemented routes</Title>
              {[
                {
                  path: '/register',
                  description: 'best practices Registration form',
                },
                {
                  path: '/activate-account/token',
                  description: 'Account activation route',
                },
                {
                  path: '/login',
                  description:
                    'Regular login form, optionally accepting a mail as url argument to prefill the form',
                },
                {
                  path: '/reset-password',
                  description: 'Form to request a password reset link',
                },
              ].map(({ path, description }) => (
                <Title as="h2" subtitle key={path}>
                  <Link to={path}>{path}</Link> - {description}
                </Title>
              ))}
            </Section>
          </Route>

          <Route>
            <Redirect to="/" />
          </Route>
          {/*</Suspense>*/}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
