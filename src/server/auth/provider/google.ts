import { Request } from 'express';
import {
  Strategy as GoogleStrategy,
  VerifyFunctionWithRequest,
  VerifyCallback,
} from 'passport-google-oauth2';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../env';
import { RawResponse } from '../middlewares';

const verify: VerifyFunctionWithRequest = (
  _: Request,
  // @ts-ignore
  accessToken: string,
  // @ts-ignore
  refreshToken: string,
  profile: RawResponse,
  done: VerifyCallback
) => {
  // TODO: database
  done(null, profile);
};

export default new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/callback/google',
    passReqToCallback: true,
    scope: ['openid', 'profile', 'email'],
  },
  verify
);
