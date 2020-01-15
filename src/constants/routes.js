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
};

export const REGISTER = {
  routerPath: '/register',
  clientPath: '/register',
  title: 'routes:register',
  icon: faUserEdit,
};

export const LOGIN = {
  routerPath: '/login/:mail?',
  clientPath: '/login',
  title: 'routes:login',
  icon: faSignInAlt,
};

export const RESET_PASSWORD = {
  routerPath: '/reset-password',
  clientPath: '/reset-password',
  title: 'routes:resetPassword',
  icon: faUnlockAlt,
};

export const ACTIVATE_ACCOUNT = {
  routerPath: '/activate-account/:token',
  clientPath: undefined,
  title: undefined,
};

export const PRIVACY_POLICY = {
  routerPath: '/privacy-policy',
  clientPath: '/privacy-policy',
  title: 'routes:privacyPolicy',
  icon: faShieldAlt,
};

export const TOS = {
  routerPath: '/tos',
  clientPath: '/tos',
  title: 'routes:tos',
  icon: faBookReader,
};

/** PRIVATE ROUTES */
export const SETTINGS = {
  routerPath: '/settings/:setting',
  clientPath: '/settings/site',
  title: 'routes:settings',
  icon: faCog,
};
