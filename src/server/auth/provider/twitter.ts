import { VerifyCallback } from 'passport-oauth2';
import {
  Strategy as TwitterStrategy,
  Profile,
  IStrategyOptionBase,
} from 'passport-twitter';

import { TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } from '../env';

const verify = (
  // @ts-ignore
  accessToken: string,
  // @ts-ignore
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  // TODO: database
  done(null, profile);
};

const options: IStrategyOptionBase = {
  callbackURL: '/api/v1/auth/callback/twitter',
  consumerKey: TWITTER_CLIENT_ID,
  consumerSecret: TWITTER_CLIENT_SECRET,
};

export default new TwitterStrategy(options, verify);
