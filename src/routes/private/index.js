import { LANDING_PAGE, SETTINGS } from '../config';
import LoadableComponent from '../loadUtils';

export const PRIVATE_ROUTES = [
  {
    path: LANDING_PAGE.routerPath,
    component: LoadableComponent(() =>
      import(/* webpackChunkName: "private.landingpage" */ './LandingPage'),
    ),
  },
  {
    path: SETTINGS.routerPath,
    component: LoadableComponent(() =>
      import(/* webpackChunkName: "private.settings" */ './SettingsRoute'),
    ),
  },
];
