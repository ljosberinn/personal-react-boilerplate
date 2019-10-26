import { faCog } from '@fortawesome/free-solid-svg-icons';

export const LANDING_PAGE = {
  routerPath: '/',
  normalizedPath: undefined,
  title: 'Home',
};

export const REGISTER = {
  routerPath: '/register',
  normalizedPath: '/register',
  title: 'Register',
};

export const LOGIN = {
  routerPath: '/login/:mail?',
  normalizedPath: '/login',
  title: 'Login',
};

export const RESET_PASSWORD = {
  routerPath: '/reset-password',
  normalizedPath: '/reset-password',
  title: 'Forgot password?',
};

export const ACTIVATE_ACCOUNT = {
  routerPath: '/activate-account/:token',
  normalizedPath: undefined,
  title: undefined,
};

export const PRIVACY_POLICY = {
  routerPath: '/privacy-policy',
  normalizedPath: '/privacy-policy',
  title: 'Privacy Policy',
};

export const TOS = {
  routerPath: '/tos',
  normalizedPath: '/tos',
  title: 'Terms of Service',
};

/** PRIVATE ROUTES */
export const SETTINGS = {
  routerPath: '/settings',
  normalizedPath: '/settings',
  title: 'Settings',
  icon: faCog,
};
