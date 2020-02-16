import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import { ENABLED_LANGUAGES } from '../constants/env';
import { withSuspense, withSentry } from '../hocs';
import LoadableComponent from './loadUtils';
import { PRIVATE_ROUTES } from './private';
import { PUBLIC_ROUTES } from './public';
import { SHARED_ROUTES, LANGUAGE_ROUTE } from './shared';

const RedirectToHome = LoadableComponent(() => import('./RedirectToHome'));

export default memo(function Routes({ isLoggedIn }) {
  const routes = {
    ...SHARED_ROUTES,
    ...(isLoggedIn ? PRIVATE_ROUTES : PUBLIC_ROUTES),
  };

  return (
    <Switch>
      {ENABLED_LANGUAGES.map(lng => (
        <Route
          path={`/${lng}`}
          key={lng}
          exact
          component={withSuspense(withSentry(LANGUAGE_ROUTE))}
        />
      ))}
      {Object.entries(routes).map(([path, component]) => (
        <Route
          path={path}
          key={path}
          component={withSuspense(withSentry(component))}
          exact
        />
      ))}
      <Route component={withSuspense(withSentry(RedirectToHome))} />
    </Switch>
  );
});
