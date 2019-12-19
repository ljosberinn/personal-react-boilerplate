import querystring from 'querystring';
import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: process.env.REACT_APP_FAUNA_DB_SECRET,
});

export async function handler({
  body,
  queryStringParameters: { language, namespace },
}) {
  const { key } = querystring.parse(body);

  const { ref, data } = await client.query(
    q.Get(
      q.Match(q.Index('i18n_by_language_and_namespace'), [language, namespace]),
    ),
  );

  return {
    statusCode: (await client.query(
      q.Update(q.Ref(ref), {
        data: {
          ...data,
          i18n: {
            ...data.i18n,
            [key]: key,
          },
        },
      }),
    ))
      ? 200
      : 500,
  };
}
