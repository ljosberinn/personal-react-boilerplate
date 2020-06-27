import nextConnect from 'next-connect';

import {
  registrationHandler,
  loginHandler,
  logoutHandler,
  externalProviderHandler,
} from '../../../../src/server/auth/routes';
import {
  expectJSONBodyMiddleware,
  sentryMiddleware,
} from '../../../../src/server/middlewares';

export default nextConnect()
  .use(sentryMiddleware)
  .use(expectJSONBodyMiddleware)
  .use(externalProviderHandler)
  .use(registrationHandler)
  .use(loginHandler)
  .use(logoutHandler);
