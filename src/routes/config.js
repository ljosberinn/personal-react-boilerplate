import {
  FaCog,
  FaBookReader,
  FaShieldAlt,
  FaUserEdit,
  FaHome,
  FaSignInAlt,
  FaUnlockAlt,
} from 'react-icons/fa';

export const LANDING_PAGE = {
  routerPath: '/',
  clientPath: '/',
  title: 'routes:landingPage',
  icon: FaHome,
  visibleInDrawerNav: false,
};

export const REGISTER = {
  routerPath: '/register',
  clientPath: '/register',
  title: 'routes:register',
  icon: FaUserEdit,
  visibleInDrawerNav: false,
};

export const LOGIN = {
  routerPath: '/login/:mail?',
  clientPath: '/login',
  title: 'routes:login',
  icon: FaSignInAlt,
  visibleInDrawerNav: false,
};

export const RESET_PASSWORD = {
  routerPath: '/reset-password',
  clientPath: '/reset-password',
  title: 'routes:resetPassword',
  icon: FaUnlockAlt,
  visibleInDrawerNav: false,
};

export const ACTIVATE_ACCOUNT = {
  routerPath: '/activate-account/:token',
  clientPath: undefined,
  title: undefined,
  visibleInDrawerNav: false,
};

export const PRIVACY_POLICY = {
  routerPath: '/privacy-policy',
  clientPath: '/privacy-policy',
  title: 'routes:privacyPolicy',
  icon: FaShieldAlt,
  visibleInDrawerNav: false,
};

export const TOS = {
  routerPath: '/tos',
  clientPath: '/tos',
  title: 'routes:tos',
  icon: FaBookReader,
  visibleInDrawerNav: false,
};

/** PRIVATE ROUTES */
export const SETTINGS = {
  routerPath: '/settings/:setting',
  clientPath: '/settings/site',
  title: 'routes:settings',
  icon: FaCog,
  visibleInDrawerNav: false,
};
