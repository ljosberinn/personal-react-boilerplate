import {
  faCog,
  faBookReader,
  faUserSecret,
  faUserEdit,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';

export const LANDING_PAGE = {
  routerPath: '/',
  normalizedPath: undefined,
  title: 'routes:landingPage',
};

export const REGISTER = {
  routerPath: '/register',
  normalizedPath: '/register',
  title: 'routes:register',
  icon: faUserEdit,
};

export const LOGIN = {
  routerPath: '/login/:mail?',
  normalizedPath: '/login',
  title: 'routes:login',
  icon: faSignInAlt,
};

export const RESET_PASSWORD = {
  routerPath: '/reset-password',
  normalizedPath: '/reset-password',
  title: 'routes:resetPassword',
};

export const ACTIVATE_ACCOUNT = {
  routerPath: '/activate-account/:token',
  normalizedPath: undefined,
  title: undefined,
};

export const PRIVACY_POLICY = {
  routerPath: '/privacy-policy',
  normalizedPath: '/privacy-policy',
  title: 'routes:privacyPolicy',
  icon: faUserSecret,
};

export const TOS = {
  routerPath: '/tos',
  normalizedPath: '/tos',
  title: 'routes:tos',
  icon: faBookReader,
};

/** PRIVATE ROUTES */
export const SETTINGS = {
  routerPath: '/settings',
  normalizedPath: '/settings',
  title: 'routes:settings',
  icon: faCog,
};
