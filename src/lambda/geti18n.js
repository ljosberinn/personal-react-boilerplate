import faunadb from 'faunadb';

import { OK } from '../utils/statusCodes';

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNA_DB_SECRET,
});

export async function handler(event, ctx) {
  console.log({ event, ctx });
  const {
    queryStringParameters: { lng, ns },
  } = event;

  const languages = lng.split(' ');
  const namespaces = ns.split(' ');

  const body = await languages.reduce(async (previousPromise, language) => {
    const carry = await previousPromise;

    return {
      ...carry,
      [language]: await namespaces.reduce(
        async (previousPromise, namespace) => {
          const carry = await previousPromise;

          const response = await client.query(
            q.Get(
              q.Match(q.Index('i18n_by_language_and_namespace'), [
                language,
                namespace,
              ]),
            ),
          );

          return { ...carry, [namespace]: response.data.i18n };
        },
        Promise.resolve({}),
      ),
    };
  }, Promise.resolve({}));

  return {
    statusCode: OK,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
