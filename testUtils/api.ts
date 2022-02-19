import { parse } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseBody } from 'next/dist/server/api-utils/node';

export class NextApiResponseMock<T = unknown>
  extends ServerResponse
  implements NextApiResponse<T>
{
  public send = jest.fn();

  public json = jest.fn();

  public redirect = jest.fn();

  public setPreviewData = jest.fn();

  public clearPreviewData = jest.fn();

  public unstable_revalidate = (urlPath: string): Promise<void> => {
    // eslint-disable-next-line no-console
    console.info(`called unstable_revalidate with ${urlPath}`);
    return Promise.resolve();
  };

  public status(code: number): this {
    this.statusCode = code;

    return this;
  }
}

export class NextApiRequestMock
  extends IncomingMessage
  implements NextApiRequest
{
  public body = {};

  public env = {};

  public query = {};

  public cookies = {};

  public req = createIncomingMessageMock();

  public constructor(req: IncomingMessage) {
    super(req.socket);

    this.cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  }
}

export const createNextApiRequestMock = (
  req: Partial<NextApiRequest> = {}
): NextApiRequest => {
  const { body, ...rest } = req;

  const request = new NextApiRequestMock(createIncomingMessageMock(req));

  Object.entries(rest).forEach(([key, value]) => {
    Object.defineProperty(request, key, { value });
  });

  if (body) {
    request.body = parseBody(request, Number.POSITIVE_INFINITY);
  }

  return request;
};

export const createIncomingMessageMock = (
  req: Partial<IncomingMessage> = {}
): IncomingMessage => {
  const request = new IncomingMessage(new Socket());

  Object.entries(req).forEach(([key, value]) => {
    Object.defineProperty(request, key, { value });
  });

  return request;
};

export const createNextApiResponse = (
  res: Partial<NextApiResponse> = {}
): NextApiResponse => {
  const apiResponseMock = new NextApiResponseMock(
    new IncomingMessage(new Socket())
  );

  Object.entries(res).forEach(([key, value]) => {
    Object.defineProperty(apiResponseMock, key, { value });
  });

  return apiResponseMock;
};

export const createServerResponseMock = (
  res: Partial<ServerResponse> = {}
): ServerResponse => {
  const response = new ServerResponse(new IncomingMessage(new Socket()));

  Object.entries(res).forEach(([key, value]) => {
    Object.defineProperty(response, key, { value });
  });

  return response;
};
