/* istanbul ignore file */
import nextConnect from 'next-connect';

import { loginHandler } from '../../../../server/auth/routes/login';
import { logoutHandler } from '../../../../server/auth/routes/logout';
import { meHandler } from '../../../../server/auth/routes/me';
import { registrationHandler } from '../../../../server/auth/routes/register';
import {
  sentryMiddleware,
  expectJSONBodyMiddleware,
} from '../../../../server/middlewares';

export default nextConnect()
  .use(sentryMiddleware)
  .use(expectJSONBodyMiddleware)
  .use(registrationHandler)
  .use(loginHandler)
  .use(logoutHandler)
  .use(meHandler);
