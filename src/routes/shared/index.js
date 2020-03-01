import { FaBookReader, FaShieldAlt } from 'react-icons/fa';

import LoadableComponent from '../loadUtils';

export const TOS = {
  routerPath: '/tos',
  clientPath: '/tos',
  title: 'routes:tos',
  icon: FaBookReader,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "shared.tos" */ './TosRoute'),
  ),
};
export const PRIVACY_POLICY = {
  routerPath: '/privacy-policy',
  clientPath: '/privacy-policy',
  title: 'routes:privacyPolicy',
  icon: FaShieldAlt,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    import(
      /* webpackChunkName: "shared.privacypolicy" */ './PrivacyPolicyRoute'
    ),
  ),
};
