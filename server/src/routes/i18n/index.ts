import * as fp from 'fastify-plugin';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  OK,
  FORBIDDEN,
} from '../../utils/statusCodes';

const readJSONFromFile = (path: string) =>
  JSON.parse(readFileSync(path, { encoding: 'utf8' }));

const loadNamespace = (namespace: string): object => {
  try {
    const path = resolve(__dirname, `../../i18n/${namespace}.json`);

    return readJSONFromFile(path);
  } catch (error) {
    console.error(error);
    return {};
  }
};

export default fp(async (server, opts, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const addToNamespace = (
      language: string,
      namespace: string,
      key: string
    ) => {
      const path = resolve(__dirname, `../../i18n/${namespace}.json`);

      if (existsSync(path)) {
        const data = readJSONFromFile(path);

        const keyExistsAndIsIdentical =
          data[language][key] && data[language][key] === key;

        if (keyExistsAndIsIdentical) {
          return;
        }

        const payload = JSON.stringify({
          ...data,
          [language]: {
            ...data[language],
            [key]: key,
          },
        });

        writeFileSync(path, payload);
      } else {
        const payload = JSON.stringify({
          [language]: { [key]: key },
        });
        writeFileSync(path, payload);
      }
    };

    server.route({
      url: '/i18n/add',
      logLevel: 'warn',
      method: ['POST', 'HEAD'],
      handler: async (request, reply) => {
        if (process.env.NODE_ENV === 'production') {
          return reply
            .status(FORBIDDEN)
            .send({ error: 'disallowed in production' });
        }

        const { language, namespace } = request.query as {
          [key: string]: string;
        };
        const { key } = request.body;

        if (!language || !namespace || !key) {
          return reply.status(BAD_REQUEST).send({
            error: 'missing parameters: language || namespace || key',
          });
        }

        try {
          addToNamespace(language, namespace, key);
          reply.status(OK).send();
        } catch (error) {
          reply.status(INTERNAL_SERVER_ERROR).send();
        }
      },
    });
  }

  server.route({
    url: '/i18n/get',
    logLevel: 'warn',
    method: ['GET', 'HEAD'],
    handler: async (request, reply) => {
      const { language, namespace } = request.query as {
        [key: string]: string;
      };

      if (!language || !namespace) {
        return reply.status(BAD_REQUEST).send({
          error: 'missing parameters: language || namespace',
        });
      }

      const languages = language.split(' ');
      const namespaces = namespace.split(' ');

      const namespaceCache = namespaces.reduce((carry, namespace) => {
        carry[namespace] = loadNamespace(namespace);

        return carry;
      }, {});

      const response = languages.reduce((carry, language) => {
        return {
          ...carry,
          [language]: namespaces.reduce((carry, namespace) => {
            return {
              ...carry,
              [namespace]: namespaceCache[namespace][language],
            };
          }, {}),
        };
      }, {});

      return reply.send(response);
    },
  });

  next();
});
