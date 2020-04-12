import * as fp from 'fastify-plugin';

import add from './add';
import get from './get';

export default fp(async (server, opts, next) => {
  if (process.env.NODE_ENV !== 'production') {
    server.route(add);
  }

  server.route(get);

  next();
});
