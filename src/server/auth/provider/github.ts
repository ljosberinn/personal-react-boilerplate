import { Strategy as GithubStrategy, StrategyOptions } from 'passport-github2';
import { VerifyFunction, VerifyCallback } from 'passport-oauth2';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../../../constants';
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
  callbackURL: '/api/v1/auth/github',
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  scope: ['user:email'],
};

export default new GithubStrategy(options, verify);
