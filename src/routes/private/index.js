import {
  LANDING_PAGE as LANDING_PAGE_CONFIG,
  SETTINGS as SETTINGS_CONFIG,
} from '../config';
import LoadableComponent from '../loadUtils';

export const LANDING_PAGE = {
  path: LANDING_PAGE_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "private.landingpage" */ './LandingPage'),
  ),
};

export const SETTINGS = {
  path: SETTINGS_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "private.settings" */ './SettingsRoute'),
  ),
};
