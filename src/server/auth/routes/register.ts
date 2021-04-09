import nextConnect from 'next-connect';

import { BAD_REQUEST, CREATED } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';

type Response = { username: string };
type Request = {
  body: {
    username: string;
    password: string;
  };
  query: {
    authRouter: string;
  };
};

const useRegistration: RequestHandler<Response, Request> = (
  { body: { username, password }, query: { authRouter } },
  res,
  next
) => {
  const [action] = authRouter;

  if (action === 'register') {
    if (!username || !password) {
      res.status(BAD_REQUEST).end();
      return;
    }

    res.status(CREATED).json({ username });
    return;
  }

  next();
};

export const registrationHandler = nextConnect().post(useRegistration);
