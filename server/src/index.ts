import * as fastify from 'fastify';
import * as fastifyBlipp from 'fastify-blipp';
import { Server, IncomingMessage, ServerResponse } from 'http';

import statusRoutes from './routes/status';

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

server.register(fastifyBlipp);
server.register(statusRoutes);

const start = async () => {
  try {
    await server.listen(5050, '0.0.0.0');
    server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on('uncaughtException', error => {
  console.error(error);
});

process.on('unhandledRejection', error => {
  console.error(error);
});

start();
