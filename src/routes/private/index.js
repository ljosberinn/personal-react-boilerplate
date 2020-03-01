import { FaCog, FaHome } from 'react-icons/fa';

import LoadableComponent from '../loadUtils';

export const LANDING_PAGE = {
  routerPath: '/',
  clientPath: '/',
  title: 'routes:landingPage',
  icon: FaHome,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "public.landing_page" */ './LandingPage'),
  ),
};

export const SETTINGS = {
  routerPath: '/settings/:setting',
  clientPath: '/settings/site',
  title: 'routes:settings',
  icon: FaCog,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    import(/* webpackChunkName: "private.settings" */ './SettingsRoute'),
  ),
};
