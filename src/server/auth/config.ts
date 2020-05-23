import { StrategyOptions } from 'passport-github2';

import { Provider } from '../../client/context/AuthContext/AuthContext';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from './env';

const getOAuthUrls = (provider: Provider) => {
  return {
    callbackURL: `http://localhost:3000/api/auth/callback/${provider}`,
  };
};

type Config = {
  [key in Provider]: StrategyOptions;
};

export const config: Config = {
  github: {
    passReqToCallback: false,
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    scope: ['user:email'],
    ...getOAuthUrls('github'),
  },

  google: {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    ...getOAuthUrls('google'),
  },
};
