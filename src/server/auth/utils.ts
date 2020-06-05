import { NextApiRequest, NextApiResponse } from 'next';
import passport, { AuthenticateOptions, Profile } from 'passport';

import { Provider } from '../../client/context/AuthContext/AuthContext';
import { RawResponse } from './types';

export const promisifyAuthentication = (
  method: Provider,
  req: NextApiRequest,
  res: NextApiResponse,
  options: AuthenticateOptions = {}
): Promise<RawResponse> =>
  new Promise((resolve, reject) => {
    const authenticationHandler = passport.authenticate(
      method,
      options,
      (error, token) => {
        if (error) {
          return reject(new Error(error));
        }

        resolve(token);
      }
    );

    authenticationHandler(req, res);
  });

export const getProfileData = (data: RawResponse): Profile => {
  const { _json, _raw, ...props } = data;

  return props;
};
