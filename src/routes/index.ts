import { LoadableComponent } from '@loadable/component';
import { IconType } from 'react-icons';
import {
  FaHome,
  FaSignInAlt,
  FaUserEdit,
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

interface RouteConfiguration extends RouteDefinition {
  childRoutes: RouteConfiguration[];
}

export const INDEX: RouteConfiguration = {
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
  childRoutes: [],
};

export const DASHBOARD: RouteConfiguration = {
  visibility: 'private',
  exact: true,
  title: 'Dashboard',
  path: {
    router: '/dashboard',
    client: dynamicPathMatcherFactory('/dashboard'),
  },
  icon: FaTachometerAlt,
  component: loadable(() =>
    import(/* webpackChunkName: "dashboard" */ './Dashboard')
  ),
  childRoutes: [],
  drawerPosition: {
    group: 1,
    position: 1,
  },
};

export const LOGIN: RouteConfiguration = {
  visibility: 'public',
  exact: true,
  title: 'Login',
  path: {
    router: '*/login',
    client: dynamicPathMatcherFactory('/login'),
  },
  icon: FaSignInAlt,
  component: loadable(() => import(/* webpackChunkName: "login" */ './Login')),
  childRoutes: [],
};

export const REGISTRATION: RouteConfiguration = {
  visibility: 'public',
  exact: true,
  title: 'Register',
  childRoutes: [],
  icon: FaUserEdit,
  component: loadable(() =>
    import(/* webpackChunkName: "registration" */ './Registration')
  ),
  path: {
    router: '/register',
    client: dynamicPathMatcherFactory('/register'),
  },
};

const SETTINGS_ACCOUNT: RouteConfiguration = {
  visibility: 'public',
  title: 'Site',
  path: {
    router: '/settings/site',
    client: dynamicPathMatcherFactory('/settings/account'),
  },
  icon: FaSlidersH,
  component: loadable(() =>
    import(/* webpackChunkName: "settings_site" */ './SettingsSite')
  ),
  exact: true,
  childRoutes: [],
};

const SETTIGS_PRIVATE: RouteConfiguration = {
  visibility: 'private',
  title: 'Account',
  path: {
    router: '/settings/account',
    client: dynamicPathMatcherFactory('/settings/account'),
  },
  icon: FaUserCog,
  component: loadable(() =>
    import(/* webpackChunkName: "settings_account" */ './SettingsAccount')
  ),
  exact: true,
  childRoutes: [],
};

export const SETTINGS: RouteConfiguration = {
  visibility: 'public',
  exact: true,
  title: 'Settings',
  childRoutes: [SETTINGS_ACCOUNT, SETTIGS_PRIVATE],
  icon: FaCog,
  path: {
    router: '/settings',
    client: dynamicPathMatcherFactory('/settings'),
  },
  component: loadable(() =>
    import(/* webpackChunkName: "settings" */ './Settings')
  ),
};

export const TOS: RouteConfiguration = {
  visibility: 'static',
  exact: true,
  title: 'Terms of Service',
  path: {
    router: '/terms-of-service',
    client: dynamicPathMatcherFactory('/terms-of-service'),
  },
  icon: FaBookReader,
  component: loadable(() =>
    import(/* webpackChunkName: "terms_of_service" */ './Tos')
  ),
  childRoutes: [],
};

export const IMPRINT: RouteConfiguration = {
  visibility: 'static',
  exact: true,
  title: 'Imprint',
  path: {
    router: '/imprint',
    client: dynamicPathMatcherFactory('/imprint'),
  },
  component: loadable(() =>
    import(/* webpackChunkName: "imprint" */ './Imprint')
  ),
  icon: FaStamp,
  childRoutes: [],
};

export const PRIVACY_POLICY: RouteConfiguration = {
  visibility: 'static',
  exact: true,
  title: 'Privacy Policy',
  path: {
    router: '/privacy-policy',
    client: dynamicPathMatcherFactory('/privacy-policy'),
  },
  icon: FaShieldAlt,
  component: loadable(() =>
    import(/* webpackChunkName: "privacy_policy" */ './PrivacyPolicy')
  ),
  childRoutes: [],
};
