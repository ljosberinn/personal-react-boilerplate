import nextConnect from 'next-connect';

import { Provider } from '../../../../client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../../constants';
import { encryptSession, setTokenCookie } from '../../../../server/auth/cookie';
import {
  authMiddleware,
  promisifyAuthentication,
} from '../../../../server/auth/middleware';
import { isGithubProfile } from '../../../../server/auth/provider';
import {
  NOT_FOUND,
  FOUND_MOVED_TEMPORARILY,
} from '../../../../utils/statusCodes';

export default nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    const provider = req.query.provider as Provider;

    if (!provider || !ENABLED_PROVIDER.includes(provider)) {
      res.status(NOT_FOUND).end();
    }

    const user = await promisifyAuthentication(provider, req, res);
    const payload = getProfileData(user);

    const token = await encryptSession(payload);

    setTokenCookie(res, token);

    res.writeHead(FOUND_MOVED_TEMPORARILY, { Location: '/' }).end();
  });

const getProfileData = (data: unknown) => {
  if (isGithubProfile(data)) {
    const {
      id,
      displayName,
      username,
      profileUrl,
      photos,
      emails,
      name,
    } = data;

    return {
      id,
      displayName,
      username,
      profileUrl,
      photos,
      emails,
      name,
    };
  }

  return data;
};
