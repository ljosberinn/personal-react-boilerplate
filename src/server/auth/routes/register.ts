import nextConnect from 'next-connect';

import { BAD_REQUEST, CREATED } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';

const useRegistration: RequestHandler<{}, { username: string }> = (
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
