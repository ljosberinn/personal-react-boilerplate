import { LANDING_PAGE, SETTINGS } from '../../constants/routes';
import LoadableComponent from '../loadUtils';

export const PRIVATE_ROUTES = {
  [LANDING_PAGE.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "private.landingpage" */ './LandingPage'),
  ),
  [SETTINGS.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "private.settings" */ './SettingsRoute'),
  ),
};
