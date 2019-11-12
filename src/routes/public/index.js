import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const PUBLIC_ROUTES = {
  [ROUTES.LANDING_PAGE.routerPath]: lazy(() =>
    import(/* webpackChunkName: "public.landingpage" */ './LandingPage'),
  ),
  [ROUTES.REGISTER.routerPath]: lazy(() =>
    import(/* webpackChunkName: "public.register" */ './RegisterRoute'),
  ),
  [ROUTES.LOGIN.routerPath]: lazy(() =>
    import(/* webpackChunkName: "public.login" */ './LoginRoute'),
  ),
  [ROUTES.RESET_PASSWORD.routerPath]: lazy(() =>
    import(
      /* webpackChunkName: "public.resetpassword" */ './ResetPasswordRoute'
    ),
  ),
  [ROUTES.ACTIVATE_ACCOUNT.routerPath]: lazy(() =>
    import(
      /* webpackChunkName: "public.accountactivation" */ './AccountActivationRoute'
    ),
  ),
};
