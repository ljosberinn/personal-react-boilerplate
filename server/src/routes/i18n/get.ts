import { HTTPMethod, RouteSchema, RequestHandler } from 'fastify';
import { resolve } from 'path';

import { readJSONFromFile } from '../../utils/json';

const loadNamespace = (namespace: string): object => {
  try {
    const path = resolve(__dirname, `../../i18n/${namespace}.json`);

    return readJSONFromFile(path);
  } catch (error) {
    console.error(error);
    return {};
  }
};

const schema: RouteSchema = {
  querystring: {
    type: 'object',
    required: ['language', 'namespace'],
    properties: {
      language: { type: 'string' },
      namespace: { type: 'string' },
    },
  },
};

const method: HTTPMethod[] = ['GET', 'HEAD'];

const handler: RequestHandler = async (request, reply) => {
  const { language, namespace } = request.query as {
    [key: string]: string;
  };

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
};

export default {
  url: '/i18n/get',
  logLevel: 'warn',
  method,
  schema,
  handler,
};
