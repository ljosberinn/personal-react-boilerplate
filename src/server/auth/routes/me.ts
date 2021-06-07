import nextConnect from 'next-connect';

import type { User } from '../../../client/context/AuthContext/types';
import { UNAUTHORIZED } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import { getSession } from '../cookie';

type Response = User;
type Request = {
  query: {
    authRouter: string[];
  };
};

const useMe: RequestHandler<Response, Request> = (req, res, next) => {
  const [action] = req.query.authRouter;

  if (action === 'me') {
    try {
      const session = getSession(req);

      if (session) {
        res.json(session);
        return;
      }

      res.status(UNAUTHORIZED).end();
      return;
    } catch {
      res.status(UNAUTHORIZED).end();
      return;
    }
  }

  next();
};

export const meHandler = nextConnect().get(useMe);
