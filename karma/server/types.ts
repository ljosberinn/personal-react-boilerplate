import type { NextApiResponse, NextApiRequest } from 'next';
import type {
  RequestHandler as NextConnectRequestHandler,
  Middleware as NextConnectMiddleware,
} from 'next-connect';

export type Middleware<T = {}, ReturnType = undefined> = NextConnectMiddleware<
  NextApiRequest & T,
  NextApiResponse<ReturnType>
>;

export type RequestHandler<
  T = {},
  ReturnType = undefined
> = NextConnectRequestHandler<
  // allows overwriting e.g. query
  NextApiRequest & T,
  NextApiResponse<ReturnType>
>;
