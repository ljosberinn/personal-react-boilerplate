import {
  Strategy as GoogleStrategy,
  VerifyFunction,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth2';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../../constants';
import { RawResponse } from '../types';

const verify: VerifyFunction = (
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

const options: StrategyOptions = {
  callbackURL: '/api/v1/auth/callback/google',
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  scope: ['openid', 'profile', 'email'],
};

export default new GoogleStrategy(options, verify);
