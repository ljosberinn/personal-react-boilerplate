import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { RequestHandler } from 'next-connect';
import passport, { AuthenticateOptions } from 'passport';

import { Provider } from '../../client/context/AuthContext/AuthContext';
import { github, google, local } from './provider';

[github, google, local].forEach(provider => passport.use(provider));

export const authMiddleware = nextConnect()
  .use((passport.initialize() as unknown) as RequestHandler)
  .use(passport.session());

export const promisifyAuthentication = (
  method: Provider,
  req: NextApiRequest,
  res: NextApiResponse,
  options: AuthenticateOptions = {}
) =>
  new Promise((resolve, reject) => {
    const authenticationHandler = passport.authenticate(
      method,
      options,
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );

    authenticationHandler(req, res);
  });
