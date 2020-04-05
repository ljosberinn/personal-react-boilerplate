import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';

import { ThemeSwitch, ScrollToTop, Navigation } from './components';
import { useNavigation } from './hooks';
import AuthAwareRedirect from './routes/AuthAwareRedirect';

export default function App() {
  const { routes } = useNavigation();

  return (
    <>
      <ScrollToTop />
      <header>
        <nav>
          <Navigation />
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
