import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const SHARED_ROUTES = {
  [ROUTES.TOS.routerPath]: lazy(() => import('./TosRoute')),
  [ROUTES.PRIVACY_POLICY.routerPath]: lazy(() =>
    import('./PrivacyPolicyRoute'),
  ),
};
