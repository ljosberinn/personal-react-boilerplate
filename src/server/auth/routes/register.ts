import { RequestHandler } from 'next-connect';

import { BAD_REQUEST, CREATED } from '../../../utils/statusCodes';

const registrationHandler: RequestHandler = (
  { body: { username, password }, query: { authRouter } },
  res,
  next
) => {
  const [action] = authRouter;

  if (action === 'signup') {
    if (!username || !password) {
      return res.status(BAD_REQUEST).end();
    }

    return res.status(CREATED).json({ username });
  }

  next();
};

export default registrationHandler;
