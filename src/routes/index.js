import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';

import { ENABLED_LANGUAGES } from '../constants/env';
import { useNavigationContext } from '../context';
import LANGUAGE_ROUTE from './LanguageRoute';
import LoadableComponent, { withMaxDelay } from './loadUtils';

const RedirectToHome = LoadableComponent(() =>
  withMaxDelay(import('./RedirectToHome')),
);

export default memo(function Routes() {
  const { routes } = useNavigationContext();

  return (
    <Switch>
      {ENABLED_LANGUAGES.map(lng => (
        <Route path={`/${lng}`} key={lng} exact component={LANGUAGE_ROUTE} />
      ))}
      {Object.values(routes).map(({ routerPath, component }) => (
        <Route path={routerPath} component={component} exact key={routerPath} />
      ))}
      <Route component={RedirectToHome} />
    </Switch>
  );
});
