import { Request } from 'express';
import {
  Strategy as GoogleStrategy,
  VerifyFunctionWithRequest,
  VerifyCallback,
} from 'passport-google-oauth2';

import { config } from '../config';

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
  { ...config.google, passReqToCallback: true },
  verify
);
