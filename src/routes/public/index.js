import { FaUserEdit, FaHome, FaSignInAlt, FaUnlockAlt } from 'react-icons/fa';

import LoadableComponent, { withMaxDelay } from '../loadUtils';

export const LANDING_PAGE = {
  routerPath: '/',
  clientPath: '/',
  title: 'routes:landingPage',
  icon: FaHome,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    withMaxDelay(
      import(/* webpackChunkName: "public.landing_page" */ './LandingPage'),
    ),
  ),
};

export const REGISTER = {
  routerPath: '/register',
  clientPath: '/register',
  title: 'routes:register',
  icon: FaUserEdit,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    withMaxDelay(
      import(/* webpackChunkName: "public.register" */ './RegisterRoute'),
    ),
  ),
};

export const LOGIN = {
  routerPath: '/login/:mail?',
  clientPath: '/login',
  title: 'routes:login',
  icon: FaSignInAlt,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    withMaxDelay(import(/* webpackChunkName: "public.login" */ './LoginRoute')),
  ),
};

export const RESET_PASSWORD = {
  routerPath: '/reset-password',
  clientPath: '/reset-password',
  title: 'routes:resetPassword',
  icon: FaUnlockAlt,
  visibleInDrawerNav: false,
  component: LoadableComponent(() =>
    withMaxDelay(
      import(
        /* webpackChunkName: "public.reset_password" */ './ResetPasswordRoute'
      ),
    ),
  ),
};
