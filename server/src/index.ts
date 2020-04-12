import * as fastify from 'fastify';
import * as fastifyBlipp from 'fastify-blipp';
import * as fastifyFormBody from 'fastify-formbody';
import { Server, IncomingMessage, ServerResponse } from 'http';

import i18n from './routes/i18n';

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

server.register(fastifyFormBody);
server.register(fastifyBlipp);
server.register(i18n);

const start = async () => {
  try {
    await server.listen(parseInt(process.env.PORT, 10) || 5050, '0.0.0.0');
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
