import { LANDING_PAGE, REGISTER, LOGIN, RESET_PASSWORD } from '../config';
import LoadableComponent from '../loadUtils';

export const PUBLIC_ROUTES = [
  {
    path: LANDING_PAGE.routerPath,
    component: LoadableComponent(() =>
      import(/* webpackChunkName: "public.landingpage" */ './LandingPage'),
    ),
  },
  {
    path: REGISTER.routerPath,
    component: LoadableComponent(() =>
      import(/* webpackChunkName: "public.register" */ './RegisterRoute'),
    ),
  },
  {
    path: LOGIN.routerPath,
    component: LoadableComponent(() =>
      import(
        /* webpackChunkName: "public.login" */ /* webpackPrefetch: true */ './LoginRoute'
      ),
    ),
  },
  {
    path: RESET_PASSWORD.routerPath,
    component: LoadableComponent(() =>
      import(
        /* webpackChunkName: "public.resetpassword" */ './ResetPasswordRoute'
      ),
    ),
  },
];
