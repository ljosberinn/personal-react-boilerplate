import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';

import { ThemeSwitch, ScrollToTop } from './components';
import { useNavigationContext } from './context';
import AuthAwareRedirect from './routes/AuthAwareRedirect';

export default function App() {
  const { routes } = useNavigationContext();

  return (
    <>
      <ScrollToTop />
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
          <Route component={AuthAwareRedirect} />
        </Switch>
      </main>
      <footer />
    </>
  );
}
