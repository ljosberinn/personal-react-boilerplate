/* istanbul ignore file */
import type { IncomingMessage } from 'http';
import type { NextApiResponse, NextApiRequest } from 'next';
import type {
  RequestHandler as NextConnectRequestHandler,
  Middleware as NextConnectMiddleware,
} from 'next-connect';

import type { User } from '../client/context/AuthContext/types';
import type { SESSION_COOKIE_NAME } from '../constants';

type EnhancedNextApiRequest = NextApiRequest & {
  [SESSION_COOKIE_NAME]: User;
};

type NextApiRequestWithoutIncomingMessage = {
  [Key in keyof EnhancedNextApiRequest as Key extends keyof IncomingMessage
    ? never
    : Key]: EnhancedNextApiRequest[Key];
};

export type Middleware<
  ReturnType = undefined,
  ExtendedApiRequest extends Partial<NextApiRequestWithoutIncomingMessage> = EnhancedNextApiRequest
> = NextConnectMiddleware<
  Omit<EnhancedNextApiRequest, keyof ExtendedApiRequest> &
    ExtendedApiRequest & {
      [Symbol.asyncIterator]: IncomingMessage[typeof Symbol.asyncIterator];
    },
  NextApiResponse<ReturnType>
>;

export type RequestHandler<
  ReturnType = undefined,
  ExtendedApiRequest extends Partial<NextApiRequestWithoutIncomingMessage> = Record<
    string,
    unknown
  >
> = NextConnectRequestHandler<
  // allows overwriting e.g. query and body
  Omit<EnhancedNextApiRequest, keyof ExtendedApiRequest> &
    ExtendedApiRequest & {
      [Symbol.asyncIterator]: IncomingMessage[typeof Symbol.asyncIterator];
    },
  NextApiResponse<ReturnType>
>;
