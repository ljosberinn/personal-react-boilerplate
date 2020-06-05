// @ts-expect-error
import { Strategy as FacebookStrategy } from '@passport-next/passport-facebook';
import { VerifyFunction, VerifyCallback } from 'passport-oauth2';

import { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from '../../../constants';
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

const options = {
  callbackURL: '/api/v1/auth/callback/facebook',
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  graphApiVersion: 'v7.0',
};

export default new FacebookStrategy(options, verify);
