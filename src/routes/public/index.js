import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const PUBLIC_ROUTES = {
  [ROUTES.LANDING_PAGE.routerPath]: lazy(() => import('./LandingPage')),
  [ROUTES.REGISTER.routerPath]: lazy(() => import('./RegisterRoute')),
  [ROUTES.LOGIN.routerPath]: lazy(() => import('./LoginRoute')),
  [ROUTES.RESET_PASSWORD.routerPath]: lazy(() =>
    import('./ResetPasswordRoute'),
  ),
  [ROUTES.ACTIVATE_ACCOUNT.routerPath]: lazy(() =>
    import('./AccountActivationRoute'),
  ),
};
