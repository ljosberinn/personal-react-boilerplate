import { TOS, PRIVACY_POLICY } from '../../constants/routes';
import LoadableComponent from '../loadUtils';

export const SHARED_ROUTES = {
  [TOS.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "shared.tos" */ './TosRoute'),
  ),
  [PRIVACY_POLICY.routerPath]: LoadableComponent(() =>
    import(
      /* webpackChunkName: "shared.privacypolicy" */ './PrivacyPolicyRoute'
    ),
  ),
};

export const LANGUAGE_ROUTE = LoadableComponent(() =>
  import(/* webpackChunkName: "shared.language" */ './LanguageRoute'),
);
