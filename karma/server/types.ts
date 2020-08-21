import { NextApiResponse, NextApiRequest } from 'next';
import {
  RequestHandler as NextConnectRequestHandler,
  Middleware as NextConnectMiddleware,
} from 'next-connect';

export type Middleware<T = {}, S = {}> = NextConnectMiddleware<
  NextApiRequest & T,
  NextApiResponse & S
>;
export type RequestHandler<T = {}, S = {}> = NextConnectRequestHandler<
  NextApiRequest & T,
  NextApiResponse & S
>;
