import { RequestHandler } from 'next-connect';
import { Profile } from 'passport';

import { ExternalProvider } from '../../../client/context/AuthContext/AuthContext';
import { ENABLED_PROVIDER } from '../../../constants';
import {
  BAD_REQUEST,
  FOUND_MOVED_TEMPORARILY,
} from '../../../utils/statusCodes';
import { encryptSession, setSessionCookie } from '../cookie';
import { RawResponse } from '../types';
import { promisifyAuthentication } from '../utils';

export const getProfileData = (data: RawResponse): Profile => {
  const { _json, _raw, ...props } = data;

  return props;
};

const externalProviderCallbackHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const [provider] = req.query.authRouter as ExternalProvider[];

  if (ENABLED_PROVIDER.includes(provider)) {
    let errored = false;

    try {
      const user = await promisifyAuthentication(provider, req, res);
      const token = await encryptSession(getProfileData(user));

      setSessionCookie(token, res);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      errored = true;
    }

    return res
      .writeHead(errored ? BAD_REQUEST : FOUND_MOVED_TEMPORARILY, {
        Location: '/',
      })
      .end();
  }

  next();
};

export default externalProviderCallbackHandler;
