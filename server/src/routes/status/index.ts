import * as fp from 'fastify-plugin';

export default fp(async (server, opts, next) => {
  server.route({
    url: '/status',
    logLevel: 'warn',
    method: ['GET', 'HEAD'],
    handler: async (request, reply) => {
      return reply.send({ date: new Date(), works: true });
    },
  });

  next();
});
