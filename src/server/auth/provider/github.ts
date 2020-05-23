import { Strategy as GithubStrategy, Profile } from 'passport-github2';
import { VerifyFunction, VerifyCallback } from 'passport-oauth2';

import { config } from '../config';

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
  [
    'id',
    'nodeId',
    'displayName',
    'username',
    'profileUrl',
    'photos',
    '_raw',
    '_json',
    'emails',
  ].every(key => key in profile);

export default new GithubStrategy(config.github, verify);
