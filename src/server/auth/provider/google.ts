import { Request } from 'express';
import {
  Strategy as GoogleStrategy,
  VerifyFunctionWithRequest,
  VerifyCallback,
} from 'passport-google-oauth2';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../env';

const verify: VerifyFunctionWithRequest = (
  _: Request,
  // @ts-ignore
  accessToken: string,
  // @ts-ignore
  refreshToken: string,
  profile: any,
  done: VerifyCallback
) => {
  // TODO: database
  done(null, profile);
};

export default new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/api/auth/callback/google',
    passReqToCallback: true,
  },
  verify
);
