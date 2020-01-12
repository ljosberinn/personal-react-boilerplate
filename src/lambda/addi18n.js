import { OK } from '../utils/statusCodes';

export async function handler({
  body,
  queryStringParameters: { language, namespace },
}) {
  return {
    statusCode: OK,
    body: 'ack',
  };
}
