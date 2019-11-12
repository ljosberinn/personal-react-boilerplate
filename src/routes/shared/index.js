import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const SHARED_ROUTES = {
  [ROUTES.TOS.routerPath]: lazy(() =>
    import(/* webpackChunkName: "shared.tos" */ './TosRoute'),
  ),
  [ROUTES.PRIVACY_POLICY.routerPath]: lazy(() =>
    import(
      /* webpackChunkName: "shared.privacypolicy" */ './PrivacyPolicyRoute'
    ),
  ),
};
