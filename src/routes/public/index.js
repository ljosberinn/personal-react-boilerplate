import * as ROUTES from '../../constants/routes';
import LoadableComponent from '../loadUtils';

export const PUBLIC_ROUTES = {
  [ROUTES.LANDING_PAGE.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "public.landingpage" */ './LandingPage'),
  ),
  [ROUTES.REGISTER.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "public.register" */ './RegisterRoute'),
  ),
  [ROUTES.LOGIN.routerPath]: LoadableComponent(() =>
    import(
      /* webpackChunkName: "public.login" */ /* webpackPrefetch: true */ './LoginRoute'
    ),
  ),
  [ROUTES.RESET_PASSWORD.routerPath]: LoadableComponent(() =>
    import(
      /* webpackChunkName: "public.resetpassword" */ './ResetPasswordRoute'
    ),
  ),
};
