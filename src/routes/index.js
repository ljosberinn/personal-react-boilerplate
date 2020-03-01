import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import { ENABLED_LANGUAGES } from '../constants/env';
import { withSuspense, withSentry } from '../hocs';
import { useNavigationContext } from '../hooks';
import LANGUAGE_ROUTE from './LanguageRoute';
import LoadableComponent from './loadUtils';

const RedirectToHome = LoadableComponent(() => import('./RedirectToHome'));

export default memo(function Routes() {
  const { routes } = useNavigationContext();

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
      {Object.values(routes).map(({ routerPath, component }) => (
        <Route
          path={routerPath}
          component={withSuspense(withSentry(component))}
          exact
          key={routerPath}
        />
      ))}
      <Route component={withSuspense(withSentry(RedirectToHome))} />
    </Switch>
  );
});
