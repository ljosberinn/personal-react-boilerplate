import React, { useMemo } from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ThemeSwitch, ScrollToTop, Helmet } from './components';
import * as ROUTES from './routes';
import { RouteDefinition } from './routes';

const routes = Object.values(ROUTES).reduce<RouteDefinition[]>(
  (carry, { childRoutes, ...route }) => [...carry, route, ...childRoutes],
  []
);

const computeCurrentRoutes = (isAuthenticated: boolean) => {
  const visibilityCriteria = ['static', isAuthenticated ? 'private' : 'public'];

  return routes.filter(({ visibility }) =>
    visibilityCriteria.includes(visibility)
  );
};

export default function App() {
  const isAuthenticated = false;

  const routes = useMemo(() => computeCurrentRoutes(isAuthenticated), [
    isAuthenticated,
  ]);

  return (
    <>
      <Helmet>
        <title>personal-react-boilerplate@next</title>
      </Helmet>
      <ScrollToTop />
      <Router>
        <header>
          <nav>
            <ThemeSwitch />
          </nav>
        </header>
        <main>
          <Switch>
            {routes.map(({ exact, component, path: { router } }) => (
              <Route
                path={router}
                component={component}
                exact={exact}
                key={router}
              />
            ))}
          </Switch>
        </main>
        <footer />
      </Router>
    </>
  );
}
