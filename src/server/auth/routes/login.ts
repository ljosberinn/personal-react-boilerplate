import nextConnect from 'next-connect';

import {
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  BAD_REQUEST,
} from '../../../utils/statusCodes';
import { RequestHandler } from '../../types';
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
    password: 'next-with-batteries!',
    username: 'ljosberinn',
  },
];

interface VerifyArg {
  username: string;
  password: string;
}

const verify = ({ username, password }: VerifyArg) => {
  // custom logic for your db goes here!
  const user = localDB.find(
    user => user.username === username && user.password === password
  );

  if (!user) {
    return null;
  }

  const { password: omittedPassword, ...response } = user;

  return response;
};

const loginHandler: RequestHandler = async (
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
        return res.status(NOT_FOUND).end();
      }

      const token = await encryptSession(user);

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

export default nextConnect().post(loginHandler);
