import nextConnect from 'next-connect';

import {
  registrationHandler,
  loginHandler,
  logoutHandler,
  externalProviderHandler,
  externalProviderCallbackHandler,
} from '../../../../src/server/auth/routes';
import {
  expectJSONBodyMiddleware,
  sentryMiddleware,
  passportMiddleware,
} from '../../../../src/server/middlewares';

export default nextConnect()
  .use(sentryMiddleware)
  .use(passportMiddleware)
  .use(expectJSONBodyMiddleware)
  .get(externalProviderHandler)
  .get(externalProviderCallbackHandler)
  .post(registrationHandler)
  .post(loginHandler)
  .delete(logoutHandler);
