import { Strategy as GithubStrategy, Profile } from 'passport-github2';
import { VerifyFunction, VerifyCallback } from 'passport-oauth2';

import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../env';

const verify: VerifyFunction = (
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

export const isGithubProfile = (profile: any): profile is Profile =>
  ['id', 'displayName', 'username', 'profileUrl', 'photos', 'emails'].every(
    key => key in profile
  );

export default new GithubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/callback/github',
    passReqToCallback: false,
    scope: ['user:email'],
  },
  verify
);
