import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const PUBLIC_ROUTES = {
  [ROUTES.LANDING_PAGE.routerPath]: lazy(() =>
    import(/* webpackChunkName: "public.landingpage" */ './LandingPage'),
  ),
  [ROUTES.REGISTER.routerPath]: lazy(() =>
    import(
      /* webpackChunkName: "public.register" */ /* webpackPrefetch: true */ './RegisterRoute'
    ),
  ),
  [ROUTES.LOGIN.routerPath]: lazy(() =>
    import(
      /* webpackChunkName: "public.login" */ /* webpackPrefetch: true */ './LoginRoute'
    ),
  ),
  [ROUTES.RESET_PASSWORD.routerPath]: lazy(() =>
    import(
      /* webpackChunkName: "public.resetpassword" */ './ResetPasswordRoute'
    ),
  ),
};
