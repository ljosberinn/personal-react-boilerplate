import nextConnect from 'next-connect';

import { loginHandler } from '../../../../karma/server/auth/routes/login';
import { logoutHandler } from '../../../../karma/server/auth/routes/logout';
import { externalProviderHandler } from '../../../../karma/server/auth/routes/provider';
import { registrationHandler } from '../../../../karma/server/auth/routes/register';
import {
  sentryMiddleware,
  expectJSONBodyMiddleware,
} from '../../../../karma/server/middlewares';

// eslint-disable-next-line import/no-default-export
export default nextConnect()
  .use(sentryMiddleware)
  .use(expectJSONBodyMiddleware)
  .use(externalProviderHandler)
  .use(registrationHandler)
  .use(loginHandler)
  .use(logoutHandler);
