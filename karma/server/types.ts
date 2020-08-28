import { NextApiResponse, NextApiRequest } from 'next';
import {
  RequestHandler as NextConnectRequestHandler,
  Middleware as NextConnectMiddleware,
} from 'next-connect';

export type Middleware<T = {}, ReturnType = void> = NextConnectMiddleware<
  NextApiRequest & T,
  NextApiResponse<ReturnType>
>;

export type RequestHandler<
  T = {},
  ReturnType = void
> = NextConnectRequestHandler<
  // allows overwriting e.g. query
  NextApiRequest & T,
  NextApiResponse<ReturnType>
>;
