import nextConnect from 'next-connect';

import { OK, UNAUTHORIZED, BAD_REQUEST } from '../../../utils/statusCodes';
import type { RequestHandler } from '../../types';
import { encryptSession, setSessionCookie } from '../cookie';

interface LocalDBDataset {
  password: string;
  displayName: string;
  id: string;
  username: string;
}

const localDB: LocalDBDataset[] = [
  {
    displayName: 'gerrit alex',
    id: '1',
    password: 'next-karma!',
    username: 'ljosberinn',
  },
];

interface VerifyArg {
  username: string;
  password: string;
}

const verify = ({
  username,
  password,
}: VerifyArg): Partial<LocalDBDataset> | null => {
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

const useLogin: RequestHandler<{}, Partial<LocalDBDataset>> = (
  { query: { authRouter = [] }, body },
  res,
  next
) => {
  const [action] = authRouter;

  if (action === 'login') {
    try {
      if (body.toString().length === 0) {
        return res.status(BAD_REQUEST).end();
      }

      const user = verify(body);

      if (!user) {
        return res.status(UNAUTHORIZED).end();
      }

      const token = encryptSession(user);

      setSessionCookie(token, res);

      return res.status(OK).json(user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      return res.status(UNAUTHORIZED).end();
    }
  }

  next();
};

export const loginHandler = nextConnect().post(useLogin);
