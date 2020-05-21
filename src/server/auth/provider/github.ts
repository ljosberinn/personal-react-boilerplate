import { Strategy as GithubStrategy, Profile } from 'passport-github2';
import { VerifyFunction, VerifyCallback } from 'passport-oauth2';

import { config } from '../config';

const verify: VerifyFunction = (
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) => {
  console.log({ accessToken, refreshToken, profile });

  // TODO: database
  done(null, profile);
};

export default new GithubStrategy(config.github, verify);
