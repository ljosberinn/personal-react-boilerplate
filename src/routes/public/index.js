import {
  LANDING_PAGE,
  REGISTER,
  LOGIN,
  RESET_PASSWORD,
} from '../../constants/routes';
import LoadableComponent from '../loadUtils';

export const PUBLIC_ROUTES = {
  [LANDING_PAGE.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "public.landingpage" */ './LandingPage'),
  ),
  [REGISTER.routerPath]: LoadableComponent(() =>
    import(/* webpackChunkName: "public.register" */ './RegisterRoute'),
  ),
  [LOGIN.routerPath]: LoadableComponent(() =>
    import(
      /* webpackChunkName: "public.login" */ /* webpackPrefetch: true */ './LoginRoute'
    ),
  ),
  [RESET_PASSWORD.routerPath]: LoadableComponent(() =>
    import(
      /* webpackChunkName: "public.resetpassword" */ './ResetPasswordRoute'
    ),
  ),
};
