import { HTTPMethod, RouteSchema, RequestHandler } from 'fastify';
import { writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

import { readJSONFromFile } from '../../utils/json';
import { INTERNAL_SERVER_ERROR, OK, FORBIDDEN } from '../../utils/statusCodes';

const addToNamespace = (language: string, namespace: string, key: string) => {
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

const schema: RouteSchema = {
  querystring: {
    type: 'object',
    required: ['language', 'namespace'],
    properties: {
      language: { type: 'string' },
      namespace: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    required: ['key', '_t'],
    key: { type: 'string' },
    _t: { type: 'string' },
  },
};

const method: HTTPMethod[] = ['POST', 'HEAD'];

const handler: RequestHandler = async (request, reply) => {
  if (process.env.NODE_ENV === 'production') {
    return reply.status(FORBIDDEN).send({ error: 'disallowed in production' });
  }

  const { language, namespace } = request.query as {
    [key: string]: string;
  };
  const { key } = request.body;

  try {
    addToNamespace(language, namespace, key);
    reply.status(OK).send();
  } catch (error) {
    reply.status(INTERNAL_SERVER_ERROR).send();
  }
};

export default {
  url: '/i18n/add',
  logLevel: 'warn',
  method,
  schema,
  handler,
};
