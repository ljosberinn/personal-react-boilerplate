import {
  faCog,
  faBookReader,
  faShieldAlt,
  faUserEdit,
  faHome,
  faSignInAlt,
  faUnlockAlt,
} from '@fortawesome/free-solid-svg-icons';

export const LANDING_PAGE = {
  routerPath: '/',
  clientPath: '/',
  title: 'routes:landingPage',
  icon: faHome,
  visibleInDrawerNav: false,
  isPublic: true,
};

export const REGISTER = {
  routerPath: '/register',
  clientPath: '/register',
  title: 'routes:register',
  icon: faUserEdit,
  visibleInDrawerNav: false,
  isPublic: true,
};

export const LOGIN = {
  routerPath: '/login/:mail?',
  clientPath: '/login',
  title: 'routes:login',
  icon: faSignInAlt,
  visibleInDrawerNav: false,
  isPublic: true,
};

export const RESET_PASSWORD = {
  routerPath: '/reset-password',
  clientPath: '/reset-password',
  title: 'routes:resetPassword',
  icon: faUnlockAlt,
  visibleInDrawerNav: false,
  isPublic: true,
};

export const ACTIVATE_ACCOUNT = {
  routerPath: '/activate-account/:token',
  clientPath: undefined,
  title: undefined,
  visibleInDrawerNav: false,
  isPublic: true,
};

export const PRIVACY_POLICY = {
  routerPath: '/privacy-policy',
  clientPath: '/privacy-policy',
  title: 'routes:privacyPolicy',
  icon: faShieldAlt,
  visibleInDrawerNav: false,
  isPublic: true,
};

export const TOS = {
  routerPath: '/tos',
  clientPath: '/tos',
  title: 'routes:tos',
  icon: faBookReader,
  visibleInDrawerNav: false,
  isPublic: true,
};

/** PRIVATE ROUTES */
export const SETTINGS = {
  routerPath: '/settings/:setting',
  clientPath: '/settings/site',
  title: 'routes:settings',
  icon: faCog,
  visibleInDrawerNav: false,
  isPublic: false,
};
