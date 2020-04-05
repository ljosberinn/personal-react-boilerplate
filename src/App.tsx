import React from 'react';
import './App.scss';
import { Switch, Route } from 'react-router-dom';

import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { useNavigation } from './hooks/useNavigation';
import { AuthAwareRedirect } from './routes/AuthAwareRedirect';

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
          {Object.values(routes).map(
            ({ exact, component, path: { router } }) => (
              <Route
                path={router}
                component={component}
                exact={exact}
                key={router}
              />
            )
          )}
          <Route component={AuthAwareRedirect} />
        </Switch>
      </main>
      <footer />
    </>
  );
}
