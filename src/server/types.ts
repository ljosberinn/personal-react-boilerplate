/* istanbul ignore file */
import type { NextApiResponse, NextApiRequest } from 'next';
import type {
  RequestHandler as NextConnectRequestHandler,
  Middleware as NextConnectMiddleware,
} from 'next-connect';

export type Middleware<
  ReturnType = undefined,
  ExtendedApiRequest = {}
> = NextConnectMiddleware<
  NextApiRequest & ExtendedApiRequest,
  NextApiResponse<ReturnType>
>;

export type RequestHandler<
  ReturnType = undefined,
  ExtendedApiRequest = {}
> = NextConnectRequestHandler<
  // allows overwriting e.g. query
  NextApiRequest & ExtendedApiRequest,
  NextApiResponse<ReturnType>
>;
