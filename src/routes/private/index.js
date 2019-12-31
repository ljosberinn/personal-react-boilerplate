import * as ROUTES from '../../constants/routes';
import LoadableComponent from '../loadUtils';

export const PRIVATE_ROUTES = {
  [ROUTES.LANDING_PAGE.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "private.landingpage" */ './LandingPage'),
  ),
  [ROUTES.SETTINGS.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "private.settings" */ './SettingsRoute'),
  ),
};
