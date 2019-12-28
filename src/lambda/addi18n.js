export async function handler({
  body,
  queryStringParameters: { language, namespace },
}) {
  return {
    statusCode: 200,
    body: 'ack',
  };
}
