import { FaBookReader, FaShieldAlt } from 'react-icons/fa';

import LoadableComponent, { withMaxDelay } from '../loadUtils';

export const TOS = {
  routerPath: '/tos',
  clientPath: '/tos',
  title: 'routes:tos',
  icon: FaBookReader,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    withMaxDelay(import(/* webpackChunkName: "shared.tos" */ './TosRoute')),
  ),
};

export const PRIVACY_POLICY = {
  routerPath: '/privacy-policy',
  clientPath: '/privacy-policy',
  title: 'routes:privacyPolicy',
  icon: FaShieldAlt,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    withMaxDelay(
      import(
        /* webpackChunkName: "shared.privacypolicy" */ './PrivacyPolicyRoute'
      ),
    ),
  ),
};
