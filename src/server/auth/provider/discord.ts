import {
  Strategy as DiscordStrategy,
  Profile,
  StrategyOptions,
} from 'passport-discord';
import { VerifyCallback } from 'passport-oauth2';

import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '../../../constants';

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

const options: StrategyOptions = {
  callbackURL: '/api/v1/auth/callback/discord',
  clientID: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  scope: ['identify'],
};

export default new DiscordStrategy(options, verify);
