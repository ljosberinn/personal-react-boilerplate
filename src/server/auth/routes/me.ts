import nextConnect from 'next-connect';

import type { User } from '../../../client/context/AuthContext/AuthContext';
import { UNAUTHORIZED } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import { getSession } from '../cookie';

const useMe: RequestHandler<{}, User> = (req, res, next) => {
  const [action] = req.query.authRouter;

  if (action === 'me') {
    try {
      const session = getSession(req);

      if (session) {
        return res.json(session);
      }

      return res.status(UNAUTHORIZED).end();
    } catch {
      return res.status(UNAUTHORIZED).end();
    }
  }

  next();
};

export const meHandler = nextConnect().get(useMe);
