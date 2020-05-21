import { StrategyOptions } from 'passport-github2';

type Provider = 'github' | 'google';

const getOAuthUrls = (provider: Provider) => {
  return {
    callbackURL: `localhost:3000/api/auth/callback/${provider}`,
  };
};

type Config = {
  [key in Provider]: StrategyOptions;
};

export const config: Config = {
  github: {
    passReqToCallback: false,
    clientID: process.env.GITHUB_CLIENT_ID || 'a',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'b',
    scope: ['user:email'],
    ...getOAuthUrls('github'),
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'c',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'd',
    ...getOAuthUrls('google'),
  },
};
