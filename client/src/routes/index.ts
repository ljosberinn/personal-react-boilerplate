import { LoadableComponent } from '@loadable/component';
import { IconType } from 'react-icons';
import {
  FaHome,
  FaTachometerAlt,
  FaCog,
  FaBookReader,
  FaShieldAlt,
  FaSlidersH,
  FaUserCog,
  FaStamp,
} from 'react-icons/fa';

import {
  dynamicPathMatcherFactory,
  loadable,
  DynamicPathMatcher,
} from './routeInternals';

export interface RouteDefinition {
  title?: string;
  exact: boolean;
  path: {
    router: string;
    client: DynamicPathMatcher;
  };
  visibility: 'public' | 'private' | 'static';
  icon: IconType;
  drawerPosition?: {
    group: number;
    position: number;
  };
  component: LoadableComponent<unknown>;
}

export const INDEX: RouteDefinition = {
  visibility: 'public',
  exact: true,
  path: {
    router: '/',
    client: dynamicPathMatcherFactory('/'),
  },
  component: loadable(() =>
    import(
      /* webpackPrefetch: true */ /* webpackChunkName: "start" */ './Start'
    )
  ),
  icon: FaHome,
};

export const DASHBOARD: RouteDefinition = {
  visibility: 'private',
  exact: true,
  title: 'dashboard',
  path: {
    router: '/dashboard',
    client: dynamicPathMatcherFactory('/dashboard'),
  },
  icon: FaTachometerAlt,
  component: loadable(() =>
    import(/* webpackChunkName: "dashboard" */ './Dashboard')
  ),
  drawerPosition: {
    group: 1,
    position: 1,
  },
};

export const SETTINGS_SITE: RouteDefinition = {
  visibility: 'static',
  title: 'site',
  path: {
    router: '/settings/site',
    client: dynamicPathMatcherFactory('/settings/site'),
  },
  icon: FaSlidersH,
  component: loadable(() =>
    import(/* webpackChunkName: "settings_site" */ './SettingsSite')
  ),
  exact: true,
};

export const SETTINGS_ACCOUNT: RouteDefinition = {
  visibility: 'private',
  title: 'account',
  path: {
    router: '/settings/account',
    client: dynamicPathMatcherFactory('/settings/account'),
  },
  icon: FaUserCog,
  component: loadable(() =>
    import(/* webpackChunkName: "settings_account" */ './SettingsAccount')
  ),
  exact: true,
};

export const SETTINGS: RouteDefinition = {
  visibility: 'public',
  exact: true,
  title: 'settings',
  icon: FaCog,
  path: {
    router: '/settings',
    client: dynamicPathMatcherFactory('/settings'),
  },
  component: loadable(() =>
    import(/* webpackChunkName: "settings" */ './Settings')
  ),
};

export const TOS: RouteDefinition = {
  visibility: 'static',
  exact: true,
  title: 'terms-of-service',
  path: {
    router: '/terms-of-service',
    client: dynamicPathMatcherFactory('/terms-of-service'),
  },
  icon: FaBookReader,
  component: loadable(() =>
    import(/* webpackChunkName: "terms_of_service" */ './Tos')
  ),
};

export const IMPRINT: RouteDefinition = {
  visibility: 'static',
  exact: true,
  title: 'imprint',
  path: {
    router: '/imprint',
    client: dynamicPathMatcherFactory('/imprint'),
  },
  component: loadable(() =>
    import(/* webpackChunkName: "imprint" */ './Imprint')
  ),
  icon: FaStamp,
};

export const PRIVACY_POLICY: RouteDefinition = {
  visibility: 'static',
  exact: true,
  title: 'privacy-policy',
  path: {
    router: '/privacy-policy',
    client: dynamicPathMatcherFactory('/privacy-policy'),
  },
  icon: FaShieldAlt,
  component: loadable(() =>
    import(/* webpackChunkName: "privacy_policy" */ './PrivacyPolicy')
  ),
};
