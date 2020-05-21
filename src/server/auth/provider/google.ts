import { Request } from 'express';
import {
  Strategy as GoogleStrategy,
  VerifyFunctionWithRequest,
  VerifyCallback,
} from 'passport-google-oauth2';

import { config } from '../config';

const verify: VerifyFunctionWithRequest = (
  _: Request,
  accessToken: string,
  refreshToken: string,
  profile: any,
  done: VerifyCallback
) => {
  console.log({ accessToken, refreshToken, profile });

  // TODO: database
  done(null, profile);
};

export default new GoogleStrategy(
  { ...config.google, passReqToCallback: true },
  verify
);
