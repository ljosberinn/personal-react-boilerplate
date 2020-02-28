import {
  TOS as TOS_CONFIG,
  PRIVACY_POLICY as PRIVACY_POLICY_CONFIG,
} from '../config';
import LoadableComponent from '../loadUtils';

export const TOS = {
  path: TOS_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "shared.tos" */ './TosRoute'),
  ),
};
export const PRIVACY_POLICY = {
  path: PRIVACY_POLICY_CONFIG.routerPath,
  component: LoadableComponent(() =>
    import(
      /* webpackChunkName: "shared.privacypolicy" */ './PrivacyPolicyRoute'
    ),
  ),
};
