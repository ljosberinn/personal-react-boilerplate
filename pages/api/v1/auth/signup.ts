import nextConnect from 'next-connect';
import { Profile } from 'passport';

import {
  passportMiddleware,
  expectJSONBodyMiddleware,
} from '../../../../src/server/auth/middlewares';
import { BAD_REQUEST, CREATED } from '../../../../src/utils/statusCodes';

const implementProfileInterface = ({
  provider = 'local',
  displayName,
  emails,
  id,
  name,
  photos,
  username,
}: Partial<Profile>): Profile => {
  return {
    displayName: displayName || username!,
    emails: emails || [],
    id: id || `${Math.floor(Math.random() * 1000)}`,
    name: name || undefined,
    photos: photos || [],
    provider,
  };
};

export default nextConnect()
  .use(passportMiddleware)
  .use(expectJSONBodyMiddleware)
  .post((req, res) => {
    if (req.body.length === 0) {
      res.status(BAD_REQUEST).end();
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(BAD_REQUEST).end();
    }

    res.status(CREATED).end(implementProfileInterface({ username }));
  });
