import nextConnect from 'next-connect';

import { OK, UNAUTHORIZED, BAD_REQUEST } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import { encryptSession, setSessionCookie } from '../cookie';

type LocalDBDataset = {
  password: string;
  displayName: string;
  id: string;
  username: string;
};

const localDB: LocalDBDataset[] = [
  {
    displayName: 'gerrit alex',
    id: '1',
    password: 'next-karma!',
    username: 'ljosberinn',
  },
];

const verify = ({
  username,
  password,
}: Record<string, unknown>): Partial<LocalDBDataset> | null => {
  // custom logic for your db goes here!
  const user = localDB.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return null;
  }

  const { password: omittedPassword, ...response } = user;

  return response;
};

type Response = Partial<LocalDBDataset>;
type Request = {
  query: {
    authRouter: string[];
  };
  body: Record<string, unknown>;
};

const useLogin: RequestHandler<Response, Request> = (
  { query: { authRouter = [] }, body },
  res,
  next
) => {
  const [action] = authRouter;

  if (action === 'login') {
    try {
      if (JSON.stringify(body).length === 0) {
        res.status(BAD_REQUEST).end();
        return;
      }

      const user = verify(body);

      if (!user) {
        res.status(UNAUTHORIZED).end();
        return;
      }

      const token = encryptSession(user);

      setSessionCookie(token, res);

      res.status(OK).json(user);
      return;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      res.status(UNAUTHORIZED).end();
      return;
    }
  }

  next();
};

export const loginHandler = nextConnect().post(useLogin);
