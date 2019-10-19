import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const PUBLIC_ROUTES = {
  [ROUTES.LANDING_PAGE]: lazy(() => import('./LandingPage')),
  [ROUTES.REGISTER]: lazy(() => import('./RegisterRoute')),
  [ROUTES.LOGIN]: lazy(() => import('./LoginRoute')),
  [ROUTES.RESET_PASSWORD]: lazy(() => import('./ResetPasswordRoute')),
  [ROUTES.ACTIVATE_ACCOUNT]: lazy(() => import('./AccountActivationRoute')),
  [ROUTES.TOS]: lazy(() => import('./TosRoute')),
  [ROUTES.PRIVACY_POLICY]: lazy(() => import('./PrivacyPolicy')),
};
