import nextConnect from 'next-connect';

import { loginHandler } from '../../../../src/server/auth/routes/login';
import { logoutHandler } from '../../../../src/server/auth/routes/logout';
import { externalProviderHandler } from '../../../../src/server/auth/routes/provider';
import { registrationHandler } from '../../../../src/server/auth/routes/register';
import {
  sentryMiddleware,
  expectJSONBodyMiddleware,
} from '../../../../src/server/middlewares';

// eslint-disable-next-line import/no-default-export
export default nextConnect()
  .use(sentryMiddleware)
  .use(expectJSONBodyMiddleware)
  .use(externalProviderHandler)
  .use(registrationHandler)
  .use(loginHandler)
  .use(logoutHandler);
