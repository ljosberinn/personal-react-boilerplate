import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const PRIVATE_ROUTES = {
  [ROUTES.LANDING_PAGE.routerPath]: lazy(() =>
    import(/* webpackChunkName: "private.landingpage" */ './LandingPage'),
  ),
  [ROUTES.SETTINGS.routerPath]: lazy(() =>
    import(/* webpackChunkName: "private.settings" */ './SettingsRoute'),
  ),
};
