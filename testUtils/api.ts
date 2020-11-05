import { parse } from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parseBody } from 'next/dist/next-server/server/api-utils';

export class NextApiResponseMock
  extends ServerResponse
  implements NextApiResponse {
  send = jest.fn();

  json = jest.fn();

  redirect = jest.fn();

  setPreviewData = jest.fn();

  clearPreviewData = jest.fn();

  status(code: number): this {
    this.statusCode = code;

    return this;
  }
}

export class NextApiRequestMock
  extends IncomingMessage
  implements NextApiRequest {
  body = {};

  env = {};

  query = {};

  cookies = {};

  constructor(req: IncomingMessage) {
    super(req.socket);

    this.cookies = req?.headers?.cookie ? parse(req.headers.cookie) : {};
  }
}

export const createNextApiRequestMock = (
  req: Partial<NextApiRequest> = {}
): NextApiRequest => {
  const { body, ...rest } = req;

  const request = new NextApiRequestMock(new IncomingMessage(new Socket()));

  Object.entries(rest).forEach(([key, value]) => {
    Object.defineProperty(request, key, { value });
  });

  if (body) {
    request.body = parseBody(request, Infinity);
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
