import { RequestHandler } from 'next-connect';
import { Profile } from 'passport';

import { BAD_REQUEST, CREATED } from '../../../utils/statusCodes';

const implementProfileInterface = ({
  provider = 'local',
  displayName,
  emails,
  id,
  name,
  photos,
  username,
}: Partial<Profile>): Profile => ({
  displayName: displayName || username!,
  emails: emails || [],
  id: id || `${Math.floor(Math.random() * 1000)}`,
  name: name || undefined,
  photos: photos || [],
  provider,
});

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

    return res.status(CREATED).json(implementProfileInterface({ username }));
  }

  next();
};

export default registrationHandler;
