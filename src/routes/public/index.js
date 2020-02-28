import {
  LANDING_PAGE as LANDING_PAGE_CONFIG,
  REGISTER as REGISTER_CONFIG,
  LOGIN as LOGIN_CONFIG,
  RESET_PASSWORD as RESET_PASSWORD_CONFIG,
} from '../config';
import LoadableComponent from '../loadUtils';

export const LANDING_PAGE = {
  path: LANDING_PAGE_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "public.landing_page" */ './LandingPage'),
  ),
};

export const REGISTER = {
  path: REGISTER_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "public.register" */ './RegisterRoute'),
  ),
};

export const LOGIN = {
  path: LOGIN_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(
      /* webpackChunkName: "public.login" */ /* webpackPrefetch: true */ './LoginRoute'
    ),
  ),
};

export const RESET_PASSWORD = {
  path: RESET_PASSWORD_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(
      /* webpackChunkName: "public.reset_password" */ './ResetPasswordRoute'
    ),
  ),
};
