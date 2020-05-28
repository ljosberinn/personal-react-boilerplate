import { Strategy as GithubStrategy } from 'passport-github2';
import { VerifyFunction, VerifyCallback } from 'passport-oauth2';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../env';
import { RawResponse } from '../middlewares';

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

export default new GithubStrategy(
  {
    callbackURL: '/api/v1/auth/callback/github',
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    passReqToCallback: false,
    scope: ['user:email'],
  },
  verify
);
