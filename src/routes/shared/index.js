import { TOS, PRIVACY_POLICY } from '../config';
import LoadableComponent from '../loadUtils';

export const SHARED_ROUTES = [
  {
    path: TOS.routerPath,
    component: LoadableComponent(() =>
      import(/* webpackChunkName: "shared.tos" */ './TosRoute'),
    ),
  },
  {
    path: PRIVACY_POLICY.routerPath,
    component: LoadableComponent(() =>
      import(
        /* webpackChunkName: "shared.privacypolicy" */ './PrivacyPolicyRoute'
      ),
    ),
  },
];

export const LANGUAGE_ROUTE = LoadableComponent(() =>
  import(/* webpackChunkName: "shared.language" */ './LanguageRoute'),
);
