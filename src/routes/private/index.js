import { lazy } from 'react';
import * as ROUTES from '../../constants/routes';

export const PRIVATE_ROUTES = {
  [ROUTES.SETTINGS.routerPath]: lazy(() =>
    import(/* webpackChunkName: "private.settings" */ './SettingsRoute'),
  ),
};
